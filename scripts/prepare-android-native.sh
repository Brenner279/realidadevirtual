#!/usr/bin/env bash
set -euo pipefail

# O projeto Android é recriado no workflow; por isso, o plugin nativo é gerado
# aqui a cada compilação, em vez de depender de arquivos Android ignorados pelo Git.
JAVA_DIR="android/app/src/main/java/com/michelbrenner/brasilimersivo"
mkdir -p "$JAVA_DIR"

cat > "$JAVA_DIR/ImmersiveModePlugin.java" <<'JAVA'
package com.michelbrenner.brasilimersivo;

import android.app.Activity;
import android.view.View;
import android.view.Window;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "ImmersiveMode")
public class ImmersiveModePlugin extends Plugin {

    @PluginMethod
    public void enter(PluginCall call) {
        setImmersiveMode(true, call);
    }

    @PluginMethod
    public void exit(PluginCall call) {
        setImmersiveMode(false, call);
    }

    private void setImmersiveMode(boolean enabled, PluginCall call) {
        final Activity activity = getActivity();
        if (activity == null) {
            call.reject("A atividade Android não está disponível.");
            return;
        }

        activity.runOnUiThread(() -> {
            try {
                Window window = activity.getWindow();
                View decorView = window.getDecorView();

                WindowCompat.setDecorFitsSystemWindows(window, !enabled);
                WindowInsetsControllerCompat controller =
                    WindowCompat.getInsetsController(window, decorView);

                if (enabled) {
                    controller.setSystemBarsBehavior(
                        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                    );
                    controller.hide(WindowInsetsCompat.Type.systemBars());
                } else {
                    controller.show(WindowInsetsCompat.Type.systemBars());
                }

                call.resolve();
            } catch (Exception error) {
                call.reject("Não foi possível alterar a visualização imersiva.", error);
            }
        });
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

echo "Plugin Android ImmersiveMode preparado."
