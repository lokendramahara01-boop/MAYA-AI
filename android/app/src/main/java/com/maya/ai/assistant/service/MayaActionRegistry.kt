package com.maya.ai.assistant.service

import android.content.Context
import android.content.Intent
import android.hardware.camera2.CameraManager
import android.net.Uri
import android.widget.Toast

class MayaActionRegistry(private val context: Context) {

    private val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
    private var isTorchOn = false

    fun handleVoiceCommand(command: String) {
        val lower = command.lowercase()

        when {
            lower.contains("youtube") || lower.contains("gaana") || lower.contains("song") -> {
                val query = lower.replace("hey maya", "")
                    .replace("youtube par", "")
                    .replace("gaana chalao", "")
                    .replace("kholo", "")
                    .trim()
                playMusicOnYouTube(query)
            }
            lower.contains("whatsapp") -> {
                openWhatsApp()
            }
            lower.contains("flashlight") || lower.contains("torch") -> {
                val turnOn = !lower.contains("band") && !lower.contains("off")
                toggleTorch(turnOn)
            }
            lower.contains("setting") -> {
                openSettings()
            }
            lower.contains("home") -> {
                MayaAccessibilityService.instance?.performHome() ?: Toast.makeText(context, "Accessibility permission required for Home navigation", Toast.LENGTH_SHORT).show()
            }
            lower.contains("back") || lower.contains("pichhli") -> {
                MayaAccessibilityService.instance?.performBack() ?: Toast.makeText(context, "Accessibility permission required for Back navigation", Toast.LENGTH_SHORT).show()
            }
            else -> {
                Toast.makeText(context, "Maya: $command", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun handleQuickAction(type: String) {
        when (type) {
            "music" -> playMusicOnYouTube("Hindi hits")
            "study" -> Toast.makeText(context, "Study mode activated!", Toast.LENGTH_SHORT).show()
            "journal" -> Toast.makeText(context, "Opening personal journal...", Toast.LENGTH_SHORT).show()
        }
    }

    fun playMusicOnYouTube(query: String) {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("vnd.youtube://results?search_query=$query")).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        try {
            context.startActivity(intent)
        } catch (e: Exception) {
            val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.youtube.com/results?search_query=$query")).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(webIntent)
        }
    }

    fun openWhatsApp() {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("whatsapp://send")).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        try {
            context.startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(context, "WhatsApp is not installed", Toast.LENGTH_SHORT).show()
        }
    }

    fun toggleTorch(turnOn: Boolean) {
        try {
            val cameraId = cameraManager.cameraIdList[0]
            cameraManager.setTorchMode(cameraId, turnOn)
            isTorchOn = turnOn
            Toast.makeText(context, if (turnOn) "Flashlight ON 🔦" else "Flashlight OFF", Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Toast.makeText(context, "Flashlight error: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    fun openSettings() {
        val intent = Intent(android.provider.Settings.ACTION_SETTINGS).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        context.startActivity(intent)
    }
}
