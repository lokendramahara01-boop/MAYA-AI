package com.maya.ai.assistant

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.maya.ai.assistant.service.MayaActionRegistry
import com.maya.ai.assistant.service.MayaVoiceManager

class MainActivity : ComponentActivity() {

    private lateinit var voiceManager: MayaVoiceManager
    private lateinit var actionRegistry: MayaActionRegistry

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val recordAudioGranted = permissions[Manifest.permission.RECORD_AUDIO] ?: false
        if (recordAudioGranted) {
            voiceManager.initSpeechRecognizer()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        actionRegistry = MayaActionRegistry(this)
        voiceManager = MayaVoiceManager(this) { spokenText ->
            // Process voice input
            actionRegistry.handleVoiceCommand(spokenText)
        }

        checkAndRequestPermissions()

        setContent {
            MayaTheme {
                MayaHomeScreen(
                    onMicClick = { voiceManager.toggleListening() },
                    isListening = voiceManager.isListeningState,
                    assistantStatus = voiceManager.statusMessage,
                    onActionClick = { actionType ->
                        actionRegistry.handleQuickAction(actionType)
                    }
                )
            }
        }
    }

    private fun checkAndRequestPermissions() {
        val permissions = arrayOf(
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.CALL_PHONE,
            Manifest.permission.READ_CONTACTS,
            Manifest.permission.CAMERA
        )
        val missing = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (missing.isNotEmpty()) {
            requestPermissionLauncher.launch(missing.toTypedArray())
        } else {
            voiceManager.initSpeechRecognizer()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        voiceManager.destroy()
    }
}

@Composable
fun MayaHomeScreen(
    onMicClick: () -> Unit,
    isListening: Boolean,
    assistantStatus: String,
    onActionClick: (String) -> Unit
) {
    Box(modifier = Modifier.fillMaxSize()) {
        // Exact User Image Background
        Image(
            painter = painterResource(id = R.drawable.maya_background),
            contentDescription = "MAYA AI Background",
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )

        // Subtle gradient overlay for readability
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0x66000B24),
                            Color(0x33000511),
                            Color(0xDD000B24)
                        )
                    )
                )
        )

        // UI Controls Layer
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { /* Open Drawer */ }) {
                    Icon(Icons.Default.Menu, contentDescription = "Menu", tint = Color(0xFF00E5FF))
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.Star,
                        contentDescription = "Crown",
                        tint = Color(0xFF00E5FF),
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Maya",
                        color = Color.White,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Row {
                    IconButton(onClick = { /* Notifications */ }) {
                        Icon(Icons.Default.Notifications, contentDescription = "Alerts", tint = Color(0xFF00E5FF))
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Action Pills & Status Cards
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Music, Study, Journal
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    NeonPill(
                        title = "Music",
                        icon = Icons.Default.MusicNote,
                        modifier = Modifier.weight(1f),
                        onClick = { onActionClick("music") }
                    )
                    NeonPill(
                        title = "Study",
                        icon = Icons.Default.MenuBook,
                        modifier = Modifier.weight(1f),
                        onClick = { onActionClick("study") }
                    )
                    NeonPill(
                        title = "Journal",
                        icon = Icons.Default.Edit,
                        modifier = Modifier.weight(1f),
                        onClick = { onActionClick("journal") }
                    )
                }

                // Weather, Today, Mood
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    InfoCard(
                        title = "Weather",
                        subtitle = "No data",
                        icon = Icons.Default.Cloud,
                        modifier = Modifier.weight(1f)
                    )
                    InfoCard(
                        title = "Today",
                        subtitle = "14 Wed, Oct",
                        icon = Icons.Default.CalendarToday,
                        modifier = Modifier.weight(1f)
                    )
                    InfoCard(
                        title = "Mood",
                        subtitle = "Warm",
                        icon = Icons.Default.Favorite,
                        modifier = Modifier.weight(1f)
                    )
                }

                // Input Bar
                Surface(
                    shape = RoundedCornerShape(24.dp),
                    color = Color(0x99001338),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, Color(0xFF00B0FF), RoundedCornerShape(24.dp))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.AttachFile, contentDescription = "Attach", tint = Color.LightGray)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (isListening) "Listening in Hindi/English..." else "Ask Maya anything...",
                            color = Color.LightGray,
                            fontSize = 14.sp,
                            modifier = Modifier.weight(1f)
                        )
                        IconButton(
                            onClick = onMicClick,
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.Send, contentDescription = "Send", tint = Color(0xFF00E5FF))
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Bottom Navigation & Animated Mic Orb
            BottomControls(
                isListening = isListening,
                onMicClick = onMicClick
            )
        }
    }
}

@Composable
fun NeonPill(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(18.dp),
        color = Color(0xAA001B4D),
        modifier = modifier
            .border(1.dp, Color(0xFF00E5FF), RoundedCornerShape(18.dp))
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(vertical = 10.dp, horizontal = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Icon(icon, contentDescription = title, tint = Color(0xFF00E5FF), modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.width(6.dp))
            Text(text = title, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
fun InfoCard(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    modifier: Modifier = Modifier
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color(0xAA001538),
        modifier = modifier.border(1.dp, Color(0xFF0091EA), RoundedCornerShape(16.dp))
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Icon(icon, contentDescription = title, tint = Color(0xFF00E5FF), modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = title, color = Color.Gray, fontSize = 11.sp)
            Text(text = subtitle, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun BottomControls(isListening: Boolean, onMicClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 8.dp),
        horizontalArrangement = Arrangement.SpaceAround,
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = {}) {
            Icon(Icons.Default.Home, contentDescription = "Home", tint = Color(0xFF00E5FF))
        }
        IconButton(onClick = {}) {
            Icon(Icons.Default.QrCodeScanner, contentDescription = "Scan", tint = Color.LightGray)
        }

        // Central Animated Orb
        val infiniteTransition = rememberInfiniteTransition(label = "pulse")
        val scale by infiniteTransition.animateFloat(
            initialValue = 1f,
            targetValue = if (isListening) 1.25f else 1.05f,
            animationSpec = infiniteRepeatable(
                animation = tween(800, easing = LinearEasing),
                repeatMode = RepeatMode.Reverse
            ),
            label = "orbScale"
        )

        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(68.dp)
                .scale(scale)
                .clip(CircleShape)
                .background(Brush.radialGradient(listOf(Color(0xFF00E5FF), Color(0xFF0044FF))))
                .border(2.dp, Color.White, CircleShape)
                .clickable { onMicClick() }
        ) {
            Icon(
                if (isListening) Icons.Default.Stop else Icons.Default.Mic,
                contentDescription = "Microphone",
                tint = Color.White,
                modifier = Modifier.size(32.dp)
            )
        }

        IconButton(onClick = {}) {
            Icon(Icons.Default.Psychology, contentDescription = "Memories", tint = Color.LightGray)
        }
        IconButton(onClick = {}) {
            Icon(Icons.Default.ChatBubble, contentDescription = "Chat", tint = Color.LightGray)
        }
    }
}

@Composable
fun MayaTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = Color(0xFF00E5FF),
            secondary = Color(0xFF0077FF),
            background = Color(0xFF000814)
        ),
        content = content
    )
}
