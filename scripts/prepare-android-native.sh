#!/usr/bin/env bash
set -euo pipefail

# O projeto Android é recriado pelo workflow. Os arquivos nativos são gerados
# nesta etapa para manter o APK independente de WebXR, Cardboard e do WebView
# durante a visualização panorâmica.
JAVA_DIR="android/app/src/main/java/com/michelbrenner/brasilimersivo"
mkdir -p "$JAVA_DIR"

cat > "$JAVA_DIR/ImmersiveModePlugin.java" <<'JAVA'
package com.michelbrenner.brasilimersivo;

import android.content.Intent;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "ImmersiveMode")
public class ImmersiveModePlugin extends Plugin {

    @PluginMethod
    public void openPanorama(PluginCall call) {
        String path = call.getString("path");
        String title = call.getString("title");
        String mediaType = call.getString("mediaType");

        if (path == null || path.trim().isEmpty() || path.startsWith("/") ||
            path.contains("..") || path.contains("\\")) {
            call.reject("Arquivo panorâmico inválido.");
            return;
        }

        if (!"image".equals(mediaType) && !"video".equals(mediaType)) {
            call.reject("Tipo de mídia inválido.");
            return;
        }

        if (title == null || title.trim().isEmpty()) {
            title = "Brasil Imersivo · 360°";
        }

        try {
            Intent intent = new Intent(getActivity(), PanoramaActivity.class);
            intent.putExtra(PanoramaActivity.EXTRA_ASSET_PATH, path);
            intent.putExtra(PanoramaActivity.EXTRA_TITLE, title);
            intent.putExtra(PanoramaActivity.EXTRA_MEDIA_TYPE, mediaType);
            getActivity().startActivity(intent);
            call.resolve();
        } catch (Exception error) {
            call.reject("Não foi possível abrir o visualizador nativo 360°.", error);
        }
    }
}
JAVA

cat > "$JAVA_DIR/MainActivity.java" <<'JAVA'
package com.michelbrenner.brasilimersivo;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ImmersiveModePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
JAVA

cat > "$JAVA_DIR/PanoramaActivity.java" <<'JAVA'
package com.michelbrenner.brasilimersivo;

import android.app.Activity;
import android.graphics.Color;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.Surface;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

public class PanoramaActivity extends Activity implements SensorEventListener {
    public static final String EXTRA_ASSET_PATH = "assetPath";
    public static final String EXTRA_TITLE = "viewerTitle";
    public static final String EXTRA_MEDIA_TYPE = "mediaType";

    private GLSurfaceViewPlaceholder placeholder;
    private android.opengl.GLSurfaceView glView;
    private PanoramaRenderer renderer;
    private SensorManager sensorManager;
    private Sensor rotationSensor;
    private float lastTouchX;
    private float lastTouchY;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String assetPath = getIntent().getStringExtra(EXTRA_ASSET_PATH);
        String title = getIntent().getStringExtra(EXTRA_TITLE);
        String mediaType = getIntent().getStringExtra(EXTRA_MEDIA_TYPE);
        boolean isVideo = "video".equals(mediaType);

        if (assetPath == null || assetPath.isEmpty()) {
            finish();
            return;
        }

        Window window = getWindow();
        window.addFlags(Window.LayoutParams.FLAG_KEEP_SCREEN_ON);
        WindowCompat.setDecorFitsSystemWindows(window, false);
        WindowInsetsControllerCompat bars =
            WindowCompat.getInsetsController(window, window.getDecorView());
        bars.setSystemBarsBehavior(
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );
        bars.hide(WindowInsetsCompat.Type.systemBars());

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.BLACK);

        glView = new android.opengl.GLSurfaceView(this);
        glView.setEGLContextClientVersion(2);
        renderer = new PanoramaRenderer(getApplicationContext(), assetPath, isVideo);
        glView.setRenderer(renderer);
        glView.setRenderMode(android.opengl.GLSurfaceView.RENDERMODE_CONTINUOUSLY);
        root.addView(glView, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ));

        TextView heading = new TextView(this);
        heading.setText(title == null ? "Brasil Imersivo · 360°" : title);
        heading.setTextColor(Color.WHITE);
        heading.setTextSize(15);
        heading.setTypeface(null, android.graphics.Typeface.BOLD);
        heading.setPadding(dp(16), dp(12), dp(16), dp(12));
        heading.setBackgroundColor(0x990D271E);
        FrameLayout.LayoutParams headingParams = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.WRAP_CONTENT,
            FrameLayout.LayoutParams.WRAP_CONTENT,
            Gravity.TOP | Gravity.START
        );
        headingParams.setMargins(dp(12), dp(16), dp(12), 0);
        root.addView(heading, headingParams);

        Button close = new Button(this);
        close.setText("Sair ✕");
        close.setTextColor(Color.WHITE);
        close.setTextSize(12);
        close.setBackgroundTintList(android.content.res.ColorStateList.valueOf(0xDD174C38));
        FrameLayout.LayoutParams closeParams = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.WRAP_CONTENT,
            dp(46),
            Gravity.TOP | Gravity.END
        );
        closeParams.setMargins(dp(12), dp(12), dp(12), 0);
        root.addView(close, closeParams);
        close.setOnClickListener(view -> finish());

        TextView hint = new TextView(this);
        hint.setText("Mova o celular para explorar o ambiente em 360°");
        hint.setTextColor(Color.WHITE);
        hint.setTextSize(12);
        hint.setGravity(Gravity.CENTER);
        hint.setPadding(dp(14), dp(9), dp(14), dp(9));
        hint.setBackgroundColor(0x880D271E);
        FrameLayout.LayoutParams hintParams = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.WRAP_CONTENT,
            FrameLayout.LayoutParams.WRAP_CONTENT,
            Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL
        );
        hintParams.setMargins(dp(12), 0, dp(12), dp(22));
        root.addView(hint, hintParams);

        glView.setOnTouchListener((view, event) -> {
            if (event.getAction() == MotionEvent.ACTION_DOWN) {
                lastTouchX = event.getX();
                lastTouchY = event.getY();
                return true;
            }
            if (event.getAction() == MotionEvent.ACTION_MOVE) {
                float dx = event.getX() - lastTouchX;
                float dy = event.getY() - lastTouchY;
                lastTouchX = event.getX();
                lastTouchY = event.getY();
                if (renderer != null) renderer.addTouchDelta(dx * 0.004f, dy * 0.004f);
                return true;
            }
            return event.getAction() == MotionEvent.ACTION_UP;
        });

        setContentView(root);

        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        rotationSensor = sensorManager == null ? null :
            sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
        if (rotationSensor == null) {
            hint.setText("Sensor de rotação não detectado. Arraste a tela para olhar ao redor.");
        }
    }

    private int dp(float value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (glView != null) glView.onResume();
        if (sensorManager != null && rotationSensor != null) {
            sensorManager.registerListener(this, rotationSensor, SensorManager.SENSOR_DELAY_GAME);
        }
        if (renderer != null && glView != null) {
            glView.queueEvent(() -> renderer.setVideoPaused(false));
        }
    }

    @Override
    protected void onPause() {
        if (sensorManager != null) sensorManager.unregisterListener(this);
        if (renderer != null && glView != null) {
            glView.queueEvent(() -> renderer.setVideoPaused(true));
        }
        if (glView != null) glView.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (renderer != null) renderer.release();
        if (glView != null) glView.onPause();
        super.onDestroy();
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (renderer == null || event.sensor.getType() != Sensor.TYPE_ROTATION_VECTOR) return;

        float[] matrix = new float[9];
        float[] adjusted = new float[9];
        float[] angles = new float[3];
        SensorManager.getRotationMatrixFromVector(matrix, event.values);

        int displayRotation = getWindowManager().getDefaultDisplay().getRotation();
        switch (displayRotation) {
            case Surface.ROTATION_90:
                SensorManager.remapCoordinateSystem(
                    matrix, SensorManager.AXIS_Y, SensorManager.AXIS_MINUS_X, adjusted
                );
                break;
            case Surface.ROTATION_180:
                SensorManager.remapCoordinateSystem(
                    matrix, SensorManager.AXIS_MINUS_X, SensorManager.AXIS_MINUS_Y, adjusted
                );
                break;
            case Surface.ROTATION_270:
                SensorManager.remapCoordinateSystem(
                    matrix, SensorManager.AXIS_MINUS_Y, SensorManager.AXIS_X, adjusted
                );
                break;
            default:
                System.arraycopy(matrix, 0, adjusted, 0, matrix.length);
                break;
        }

        SensorManager.getOrientation(adjusted, angles);
        renderer.setSensorOrientation(angles[0], angles[1]);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) { }
}

/* Apenas um tipo auxiliar para manter a Activity autocontida. */
class GLSurfaceViewPlaceholder { }
JAVA

cat > "$JAVA_DIR/PanoramaRenderer.java" <<'JAVA'
package com.michelbrenner.brasilimersivo;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.SurfaceTexture;
import android.media.MediaPlayer;
import android.opengl.GLES11Ext;
import android.opengl.GLES20;
import android.opengl.GLSurfaceView;
import android.opengl.GLUtils;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.Surface;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

public class PanoramaRenderer implements GLSurfaceView.Renderer {
    private static final String TAG = "BrasilImersivo360";
    private static final String VERTEX_SHADER =
        "attribute vec2 aPosition;\n" +
        "attribute vec2 aUv;\n" +
        "varying vec2 vUv;\n" +
        "void main(){ vUv=aUv; gl_Position=vec4(aPosition,0.0,1.0); }";

    private static final String IMAGE_FRAGMENT =
        "precision mediump float;\n" +
        "varying vec2 vUv;\n" +
        "uniform sampler2D uTexture;\n" +
        "uniform float uYaw; uniform float uPitch; uniform float uAspect;\n" +
        "void main(){\n" +
        " float f=0.78;\n" +
        " vec3 d=normalize(vec3((vUv.x*2.0-1.0)*uAspect*f,(1.0-vUv.y*2.0)*f,-1.0));\n" +
        " float cp=cos(uPitch), sp=sin(uPitch);\n" +
        " d=vec3(d.x,d.y*cp-d.z*sp,d.y*sp+d.z*cp);\n" +
        " float cy=cos(uYaw), sy=sin(uYaw);\n" +
        " d=vec3(d.x*cy+d.z*sy,d.y,-d.x*sy+d.z*cy);\n" +
        " float lon=atan(d.x,-d.z); float lat=asin(clamp(d.y,-1.0,1.0));\n" +
        " vec2 pano=vec2(0.5+lon/6.2831853,0.5-lat/3.14159265);\n" +
        " gl_FragColor=texture2D(uTexture,vec2(pano.x,1.0-pano.y));\n" +
        "}";

    private static final String VIDEO_FRAGMENT =
        "#extension GL_OES_EGL_image_external : require\n" +
        "precision mediump float;\n" +
        "varying vec2 vUv;\n" +
        "uniform samplerExternalOES uTexture;\n" +
        "uniform mat4 uTexMatrix;\n" +
        "uniform float uYaw; uniform float uPitch; uniform float uAspect;\n" +
        "void main(){\n" +
        " float f=0.78;\n" +
        " vec3 d=normalize(vec3((vUv.x*2.0-1.0)*uAspect*f,(1.0-vUv.y*2.0)*f,-1.0));\n" +
        " float cp=cos(uPitch), sp=sin(uPitch);\n" +
        " d=vec3(d.x,d.y*cp-d.z*sp,d.y*sp+d.z*cp);\n" +
        " float cy=cos(uYaw), sy=sin(uYaw);\n" +
        " d=vec3(d.x*cy+d.z*sy,d.y,-d.x*sy+d.z*cy);\n" +
        " float lon=atan(d.x,-d.z); float lat=asin(clamp(d.y,-1.0,1.0));\n" +
        " vec2 pano=vec2(0.5+lon/6.2831853,0.5-lat/3.14159265);\n" +
        " vec4 uv=uTexMatrix*vec4(pano,0.0,1.0);\n" +
        " gl_FragColor=texture2D(uTexture,uv.xy);\n" +
        "}";

    private final Context context;
    private final String assetPath;
    private final boolean video;
    private final FloatBuffer quad;
    private final AtomicBoolean frameAvailable = new AtomicBoolean(false);
    private final float[] textureMatrix = new float[16];

    private int program;
    private int textureId;
    private int textureTarget;
    private int width = 1;
    private int height = 1;
    private SurfaceTexture surfaceTexture;
    private Surface mediaSurface;
    private MediaPlayer mediaPlayer;
    private volatile boolean videoPrepared = false;
    private volatile boolean videoPaused = false;

    private volatile float sensorYaw = 0f;
    private volatile float sensorPitch = 0f;
    private volatile float touchYaw = 0f;
    private volatile float touchPitch = 0f;
    private boolean hasReference = false;
    private float referenceYaw = 0f;
    private float referencePitch = 0f;

    public PanoramaRenderer(Context context, String assetPath, boolean video) {
        this.context = context;
        this.assetPath = assetPath;
        this.video = video;

        float[] vertices = {
            -1f, -1f, 0f, 1f,
             1f, -1f, 1f, 1f,
            -1f,  1f, 0f, 0f,
             1f,  1f, 1f, 0f
        };
        quad = ByteBuffer.allocateDirect(vertices.length * 4)
            .order(ByteOrder.nativeOrder()).asFloatBuffer();
        quad.put(vertices).position(0);
    }

    @Override
    public void onSurfaceCreated(GL10 gl, EGLConfig config) {
        GLES20.glClearColor(0f, 0f, 0f, 1f);
        GLES20.glDisable(GLES20.GL_DEPTH_TEST);

        program = createProgram(VERTEX_SHADER, video ? VIDEO_FRAGMENT : IMAGE_FRAGMENT);
        textureTarget = video ? GLES11Ext.GL_TEXTURE_EXTERNAL_OES : GLES20.GL_TEXTURE_2D;
        int[] textures = new int[1];
        GLES20.glGenTextures(1, textures, 0);
        textureId = textures[0];

        GLES20.glBindTexture(textureTarget, textureId);
        GLES20.glTexParameteri(textureTarget, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR);
        GLES20.glTexParameteri(textureTarget, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR);
        GLES20.glTexParameteri(textureTarget, GLES20.GL_TEXTURE_WRAP_S, GLES20.GL_REPEAT);
        GLES20.glTexParameteri(textureTarget, GLES20.GL_TEXTURE_WRAP_T, GLES20.GL_CLAMP_TO_EDGE);

        if (video) {
            prepareVideoSurface();
        } else {
            loadImageTexture();
        }
    }

    @Override
    public void onSurfaceChanged(GL10 gl, int width, int height) {
        this.width = Math.max(1, width);
        this.height = Math.max(1, height);
        GLES20.glViewport(0, 0, this.width, this.height);
    }

    @Override
    public void onDrawFrame(GL10 gl) {
        GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT);
        if (video && surfaceTexture != null && frameAvailable.compareAndSet(true, false)) {
            try {
                surfaceTexture.updateTexImage();
                surfaceTexture.getTransformMatrix(textureMatrix);
            } catch (Exception error) {
                Log.w(TAG, "Não foi possível atualizar o frame do vídeo.", error);
            }
        }

        GLES20.glUseProgram(program);
        int position = GLES20.glGetAttribLocation(program, "aPosition");
        int uv = GLES20.glGetAttribLocation(program, "aUv");
        quad.position(0);
        GLES20.glEnableVertexAttribArray(position);
        GLES20.glVertexAttribPointer(position, 2, GLES20.GL_FLOAT, false, 16, quad);
        quad.position(2);
        GLES20.glEnableVertexAttribArray(uv);
        GLES20.glVertexAttribPointer(uv, 2, GLES20.GL_FLOAT, false, 16, quad);

        GLES20.glActiveTexture(GLES20.GL_TEXTURE0);
        GLES20.glBindTexture(textureTarget, textureId);
        GLES20.glUniform1i(GLES20.glGetUniformLocation(program, "uTexture"), 0);
        GLES20.glUniform1f(GLES20.glGetUniformLocation(program, "uYaw"), sensorYaw + touchYaw);
        GLES20.glUniform1f(GLES20.glGetUniformLocation(program, "uPitch"),
            Math.max(-1.35f, Math.min(1.35f, sensorPitch + touchPitch)));
        GLES20.glUniform1f(GLES20.glGetUniformLocation(program, "uAspect"),
            (float) width / (float) height);

        if (video) {
            int matrixLocation = GLES20.glGetUniformLocation(program, "uTexMatrix");
            GLES20.glUniformMatrix4fv(matrixLocation, 1, false, textureMatrix, 0);
        }

        GLES20.glDrawArrays(GLES20.GL_TRIANGLE_STRIP, 0, 4);
        GLES20.glDisableVertexAttribArray(position);
        GLES20.glDisableVertexAttribArray(uv);
    }

    public synchronized void setSensorOrientation(float yaw, float pitch) {
        if (!hasReference) {
            referenceYaw = yaw;
            referencePitch = pitch;
            hasReference = true;
        }
        float deltaYaw = yaw - referenceYaw;
        if (deltaYaw > Math.PI) deltaYaw -= (float) (Math.PI * 2.0);
        if (deltaYaw < -Math.PI) deltaYaw += (float) (Math.PI * 2.0);
        sensorYaw = -deltaYaw;
        sensorPitch = pitch - referencePitch;
    }

    public synchronized void addTouchDelta(float dx, float dy) {
        touchYaw -= dx;
        touchPitch += dy;
    }

    private int compileShader(int type, String source) {
        int shader = GLES20.glCreateShader(type);
        GLES20.glShaderSource(shader, source);
        GLES20.glCompileShader(shader);
        int[] status = new int[1];
        GLES20.glGetShaderiv(shader, GLES20.GL_COMPILE_STATUS, status, 0);
        if (status[0] == 0) {
            String log = GLES20.glGetShaderInfoLog(shader);
            GLES20.glDeleteShader(shader);
            throw new RuntimeException("Falha no shader panorâmico: " + log);
        }
        return shader;
    }

    private int createProgram(String vertexSource, String fragmentSource) {
        int vertex = compileShader(GLES20.GL_VERTEX_SHADER, vertexSource);
        int fragment = compileShader(GLES20.GL_FRAGMENT_SHADER, fragmentSource);
        int result = GLES20.glCreateProgram();
        GLES20.glAttachShader(result, vertex);
        GLES20.glAttachShader(result, fragment);
        GLES20.glLinkProgram(result);
        int[] status = new int[1];
        GLES20.glGetProgramiv(result, GLES20.GL_LINK_STATUS, status, 0);
        GLES20.glDeleteShader(vertex);
        GLES20.glDeleteShader(fragment);
        if (status[0] == 0) {
            String log = GLES20.glGetProgramInfoLog(result);
            GLES20.glDeleteProgram(result);
            throw new RuntimeException("Falha ao vincular o shader panorâmico: " + log);
        }
        return result;
    }

    private void loadImageTexture() {
        try (InputStream input = context.getAssets().open("public/" + assetPath)) {
            Bitmap bitmap = BitmapFactory.decodeStream(input);
            if (bitmap == null) throw new IllegalStateException("A imagem não pôde ser decodificada.");
            GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, textureId);
            GLUtils.texImage2D(GLES20.GL_TEXTURE_2D, 0, bitmap, 0);
            bitmap.recycle();
        } catch (Exception error) {
            Log.e(TAG, "Falha ao carregar o panorama " + assetPath, error);
        }
    }

    private void prepareVideoSurface() {
        surfaceTexture = new SurfaceTexture(textureId);
        surfaceTexture.setOnFrameAvailableListener(st -> frameAvailable.set(true));
        mediaSurface = new Surface(surfaceTexture);

        new Handler(Looper.getMainLooper()).post(() -> {
            try {
                File cachedVideo = copyVideoToCache();
                mediaPlayer = new MediaPlayer();
                mediaPlayer.setDataSource(cachedVideo.getAbsolutePath());
                mediaPlayer.setSurface(mediaSurface);
                mediaPlayer.setLooping(true);
                mediaPlayer.setOnPreparedListener(player -> {
                    videoPrepared = true;
                    if (!videoPaused) player.start();
                });
                mediaPlayer.setOnErrorListener((player, what, extra) -> {
                    Log.e(TAG, "Erro no vídeo 360°: " + what + "/" + extra);
                    return true;
                });
                mediaPlayer.prepareAsync();
            } catch (Exception error) {
                Log.e(TAG, "Falha ao preparar o vídeo panorâmico " + assetPath, error);
            }
        });
    }

    private File copyVideoToCache() throws Exception {
        String name = assetPath.substring(assetPath.lastIndexOf('/') + 1);
        File target = new File(context.getCacheDir(), "brasil-imersivo-" + name);
        if (target.exists() && target.length() > 0) return target;

        try (InputStream input = context.getAssets().open("public/" + assetPath);
             FileOutputStream output = new FileOutputStream(target)) {
            byte[] buffer = new byte[64 * 1024];
            int read;
            while ((read = input.read(buffer)) != -1) output.write(buffer, 0, read);
            output.flush();
        }
        return target;
    }

    public void setVideoPaused(boolean paused) {
        videoPaused = paused;
        MediaPlayer player = mediaPlayer;
        if (player == null || !videoPrepared) return;
        try {
            if (paused && player.isPlaying()) player.pause();
            else if (!paused && !player.isPlaying()) player.start();
        } catch (IllegalStateException error) {
            Log.w(TAG, "Estado do player alterado durante pausa/retomada.", error);
        }
    }

    public void release() {
        MediaPlayer player = mediaPlayer;
        mediaPlayer = null;
        if (player != null) {
            try { player.stop(); } catch (Exception ignored) { }
            try { player.release(); } catch (Exception ignored) { }
        }
        if (mediaSurface != null) {
            mediaSurface.release();
            mediaSurface = null;
        }
        if (surfaceTexture != null) {
            surfaceTexture.release();
            surfaceTexture = null;
        }
    }
}
JAVA

python3 - <<'PY'
from pathlib import Path
manifest = Path("android/app/src/main/AndroidManifest.xml")
text = manifest.read_text(encoding="utf-8")
activity = '''
        <activity
            android:name=".PanoramaActivity"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:exported="false"
            android:screenOrientation="sensor" />
'''
if ".PanoramaActivity" not in text:
    if "</application>" not in text:
        raise SystemExit("Tag application não encontrada no AndroidManifest.xml.")
    text = text.replace("</application>", activity + "    </application>")
    manifest.write_text(text, encoding="utf-8")
PY

echo "Visualizador panorâmico Android nativo preparado."
