<template>
  <svg
    class="zaki"
    :class="[`mood-${mood}`, { 'zaki--animated': animated }]"
    viewBox="0 0 180 250"
    xmlns="http://www.w3.org/2000/svg"
    :width="sizeMap[size] ?? 88"
    height="auto"
    role="img"
    aria-label="Zaki le robot"
  >
    <defs>
      <filter id="zaki-glow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="zaki-glow-sm" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id="zaki-body-g" cx="35%" cy="25%" r="70%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#E8EDF2"/>
      </radialGradient>
      <radialGradient id="zaki-head-g" cx="32%" cy="22%" r="72%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#EEF2F6"/>
      </radialGradient>
    </defs>

    <!-- ══ THRUSTER ══════════════════════════════════════ -->
    <rect x="68" y="208" width="44" height="13" rx="6.5" fill="#1C2731"/>
    <ellipse class="thruster-glow" cx="90" cy="228" rx="22" ry="14" fill="#0099DD" opacity="0.35" filter="url(#zaki-glow)"/>
    <ellipse class="thruster-mid"  cx="90" cy="225" rx="13" ry="9"  fill="#00C4FF" opacity="0.85"/>
    <ellipse cx="90" cy="222" rx="7"  ry="5"  fill="#80DFFF"/>
    <ellipse cx="90" cy="220" rx="3.5" ry="3" fill="white" opacity="0.95"/>

    <!-- ══ HANGING ARM (right side of screen = robot's left) ═══ -->
    <g class="arm-hang">
      <circle cx="134" cy="158" r="9" fill="#37474F"/>
      <rect x="127" y="158" width="15" height="30" rx="7" fill="#455A64"/>
      <circle cx="132" cy="188" r="7" fill="#37474F"/>
      <rect x="126" y="188" width="13" height="25" rx="6" fill="#546E7A"/>
      <circle cx="131" cy="214" r="10" fill="#37474F"/>
      <line x1="125" y1="208" x2="121" y2="202" stroke="#263238" stroke-width="3" stroke-linecap="round"/>
      <line x1="131" y1="206" x2="129" y2="200" stroke="#263238" stroke-width="3" stroke-linecap="round"/>
      <line x1="137" y1="208" x2="139" y2="203" stroke="#263238" stroke-width="3" stroke-linecap="round"/>
    </g>

    <!-- ══ BODY ════════════════════════════════════════════ -->
    <rect x="46" y="144" width="88" height="66" rx="28" fill="url(#zaki-body-g)" stroke="#D4DBE3" stroke-width="1.5"/>
    <!-- Blue top stripe -->
    <rect x="46" y="144" width="88" height="10" rx="5" fill="#1565C0"/>
    <!-- Blue bottom stripe -->
    <rect x="46" y="200" width="88" height="10" rx="5" fill="#0D47A1"/>
    <!-- Chest badge yellow -->
    <rect x="58" y="160" width="64" height="34" rx="10" fill="#F0B429"/>
    <rect x="60" y="162" width="60" height="30" rx="8" fill="#F5BE3A" opacity="0.45"/>
    <!-- "Zaki" text -->
    <text x="90" y="182" text-anchor="middle"
      font-family="'Arial Rounded MT Bold', 'Varela Round', Arial, sans-serif"
      font-weight="900" font-size="15" fill="#0D47A1" letter-spacing="0.5">Zaki</text>
    <!-- Side body details -->
    <circle cx="55"  cy="180" r="4" fill="#1565C0" opacity="0.5"/>
    <circle cx="125" cy="180" r="4" fill="#1565C0" opacity="0.5"/>

    <!-- ══ WAVE ARM (left side of screen = robot's right) ══ -->
    <!-- Default wave pose -->
    <g class="arm-wave arm-wave--default">
      <circle cx="46" cy="158" r="9" fill="#37474F"/>
      <!-- upper arm angled up-left -->
      <rect x="30" y="130" width="15" height="30" rx="7" fill="#455A64"
            transform="rotate(-35 46 158)"/>
      <circle cx="26" cy="136" r="7" fill="#37474F"/>
      <!-- lower arm -->
      <rect x="14" y="110" width="13" height="26" rx="6" fill="#546E7A"
            transform="rotate(-20 26 136)"/>
      <!-- hand -->
      <circle cx="14" cy="110" r="10" fill="#37474F"/>
      <!-- spread fingers -->
      <line x1="8"  y1="103" x2="4"  y2="96"  stroke="#263238" stroke-width="3" stroke-linecap="round"/>
      <line x1="13" y1="101" x2="11" y2="94"  stroke="#263238" stroke-width="3" stroke-linecap="round"/>
      <line x1="18" y1="101" x2="19" y2="94"  stroke="#263238" stroke-width="3" stroke-linecap="round"/>
      <line x1="22" y1="104" x2="26" y2="99"  stroke="#263238" stroke-width="3" stroke-linecap="round"/>
    </g>
    <!-- Both arms raised (celebrating / victory) -->
    <g class="arm-wave arm-wave--up" style="display:none">
      <circle cx="46" cy="158" r="9" fill="#37474F"/>
      <rect x="30" y="122" width="15" height="30" rx="7" fill="#455A64"
            transform="rotate(-55 46 158)"/>
      <circle cx="22" cy="124" r="7" fill="#37474F"/>
      <rect x="12" y="104" width="13" height="24" rx="6" fill="#546E7A"
            transform="rotate(-40 22 124)"/>
      <circle cx="10" cy="100" r="10" fill="#37474F"/>
    </g>

    <!-- ══ HEAD ════════════════════════════════════════════ -->
    <ellipse cx="90" cy="84" rx="64" ry="68" fill="url(#zaki-head-g)" stroke="#D4DBE3" stroke-width="1.5"/>

    <!-- Yellow cap on top -->
    <path d="M 38 66 C 42 24 138 24 142 66 C 124 52 56 52 38 66 Z" fill="#F0B429"/>
    <path d="M 52 58 C 58 32 122 32 128 58 C 116 44 64 44 52 58 Z" fill="#F5BE3A" opacity="0.55"/>

    <!-- ══ SCREEN CHROME + BLACK ═══════════════════════════ -->
    <rect x="30" y="46" width="120" height="82" rx="22" fill="#B0BEC5"/>
    <rect x="32" y="48" width="116" height="78" rx="20" fill="#CFD8DC"/>
    <rect x="36" y="52" width="108" height="70" rx="17" fill="#070918"/>
    <!-- Subtle glass reflection -->
    <rect x="36" y="52" width="56" height="16" rx="8" fill="white" opacity="0.035"/>

    <!-- ══ FACE — mood-driven ══════════════════════════════ -->

    <!-- NORMAL EYES (happy, encouraging, proud, resting, default) -->
    <g class="face-eyes eyes--normal">
      <g filter="url(#zaki-glow-sm)">
        <circle cx="68" cy="83" r="14" fill="#0090D0" opacity="0.4"/>
        <circle cx="68" cy="83" r="12" fill="#00AAEE"/>
        <circle cx="68" cy="83" r="8"  fill="#006EA8"/>
        <circle cx="70" cy="85" r="5.5" fill="#03101E"/>
        <circle cx="65" cy="79" r="3"  fill="white" opacity="0.9"/>
      </g>
      <g filter="url(#zaki-glow-sm)">
        <circle cx="112" cy="83" r="14" fill="#0090D0" opacity="0.4"/>
        <circle cx="112" cy="83" r="12" fill="#00AAEE"/>
        <circle cx="112" cy="83" r="8"  fill="#006EA8"/>
        <circle cx="114" cy="85" r="5.5" fill="#03101E"/>
        <circle cx="109" cy="79" r="3"  fill="white" opacity="0.9"/>
      </g>
    </g>

    <!-- WIDE EYES (excited, surprised) -->
    <g class="face-eyes eyes--wide" style="display:none">
      <g filter="url(#zaki-glow-sm)">
        <circle cx="68" cy="83" r="17" fill="#0099E8" opacity="0.4"/>
        <circle cx="68" cy="83" r="15" fill="#00BBFF"/>
        <circle cx="68" cy="83" r="10" fill="#007ACC"/>
        <circle cx="71" cy="86" r="7"  fill="#02101E"/>
        <circle cx="63" cy="78" r="4"  fill="white" opacity="0.9"/>
        <circle cx="76" cy="76" r="2"  fill="white" opacity="0.6"/>
      </g>
      <g filter="url(#zaki-glow-sm)">
        <circle cx="112" cy="83" r="17" fill="#0099E8" opacity="0.4"/>
        <circle cx="112" cy="83" r="15" fill="#00BBFF"/>
        <circle cx="112" cy="83" r="10" fill="#007ACC"/>
        <circle cx="115" cy="86" r="7"  fill="#02101E"/>
        <circle cx="107" cy="78" r="4"  fill="white" opacity="0.9"/>
        <circle cx="120" cy="76" r="2"  fill="white" opacity="0.6"/>
      </g>
    </g>

    <!-- ARC EYES ^_^ (celebrating, very_happy) -->
    <g class="face-eyes eyes--arc" style="display:none">
      <path d="M 55 88 Q 68 70 81 88"  stroke="#00DDFF" stroke-width="5" fill="none" stroke-linecap="round" filter="url(#zaki-glow-sm)"/>
      <path d="M 57 88 Q 68 72 79 88"  stroke="#88EEFF" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
      <path d="M 99 88 Q 112 70 125 88" stroke="#00DDFF" stroke-width="5" fill="none" stroke-linecap="round" filter="url(#zaki-glow-sm)"/>
      <path d="M 101 88 Q 112 72 123 88" stroke="#88EEFF" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
    </g>

    <!-- WORRIED EYES (sad, worried) -->
    <g class="face-eyes eyes--worried" style="display:none">
      <g filter="url(#zaki-glow-sm)">
        <circle cx="68" cy="85" r="11" fill="#0077BB" opacity="0.35"/>
        <circle cx="68" cy="85" r="9"  fill="#0088CC" opacity="0.75"/>
        <circle cx="68" cy="85" r="6"  fill="#004E77"/>
        <circle cx="69" cy="87" r="4.5" fill="#02101E"/>
        <circle cx="65" cy="82" r="2.5" fill="white" opacity="0.7"/>
        <path d="M 59 76 L 72 80" stroke="#0088CC" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
      </g>
      <g filter="url(#zaki-glow-sm)">
        <circle cx="112" cy="85" r="11" fill="#0077BB" opacity="0.35"/>
        <circle cx="112" cy="85" r="9"  fill="#0088CC" opacity="0.75"/>
        <circle cx="112" cy="85" r="6"  fill="#004E77"/>
        <circle cx="113" cy="87" r="4.5" fill="#02101E"/>
        <circle cx="109" cy="82" r="2.5" fill="white" opacity="0.7"/>
        <path d="M 108 80 L 121 76" stroke="#0088CC" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
      </g>
    </g>

    <!-- SQUINT EYES (thinking, focused) -->
    <g class="face-eyes eyes--squint" style="display:none">
      <g filter="url(#zaki-glow-sm)">
        <ellipse cx="68" cy="84" rx="12" ry="7" fill="#0090D0" opacity="0.4"/>
        <ellipse cx="68" cy="84" rx="10" ry="6" fill="#00AAEE"/>
        <ellipse cx="68" cy="84" rx="7"  ry="4" fill="#006EA8"/>
        <ellipse cx="69" cy="85" rx="4.5" ry="3.5" fill="#02101E"/>
        <circle cx="65" cy="82" r="2" fill="white" opacity="0.85"/>
        <path d="M 57 78 L 79 78" stroke="#00AAEE" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
      </g>
      <g filter="url(#zaki-glow-sm)">
        <ellipse cx="112" cy="84" rx="12" ry="7" fill="#0090D0" opacity="0.4"/>
        <ellipse cx="112" cy="84" rx="10" ry="6" fill="#00AAEE"/>
        <ellipse cx="112" cy="84" rx="7"  ry="4" fill="#006EA8"/>
        <ellipse cx="113" cy="85" rx="4.5" ry="3.5" fill="#02101E"/>
        <circle cx="109" cy="82" r="2" fill="white" opacity="0.85"/>
        <path d="M 101 78 L 123 78" stroke="#00AAEE" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
      </g>
    </g>

    <!-- WINK (victory — left normal, right closed arc) -->
    <g class="face-eyes eyes--wink" style="display:none">
      <g filter="url(#zaki-glow-sm)">
        <circle cx="68" cy="83" r="14" fill="#0090D0" opacity="0.4"/>
        <circle cx="68" cy="83" r="12" fill="#00AAEE"/>
        <circle cx="68" cy="83" r="8"  fill="#006EA8"/>
        <circle cx="70" cy="85" r="5.5" fill="#03101E"/>
        <circle cx="65" cy="79" r="3"  fill="white" opacity="0.9"/>
      </g>
      <path d="M 100 83 Q 112 73 124 83" stroke="#00DDFF" stroke-width="5" fill="none"
            stroke-linecap="round" filter="url(#zaki-glow-sm)"/>
      <path d="M 102 83 Q 112 75 122 83" stroke="#80EEFF" stroke-width="3" fill="none"
            stroke-linecap="round" opacity="0.6"/>
    </g>

    <!-- ══ MOUTHS ════════════════════════════════════════ -->
    <!-- Gentle smile -->
    <path class="mouth mouth--smile"
      d="M 78 106 Q 90 117 102 106"
      stroke="#00CCFF" stroke-width="4" fill="none" stroke-linecap="round"
      filter="url(#zaki-glow-sm)"/>

    <!-- Big smile -->
    <path class="mouth mouth--big"
      d="M 73 104 Q 90 120 107 104"
      stroke="#00CCFF" stroke-width="4.5" fill="none" stroke-linecap="round"
      filter="url(#zaki-glow-sm)" style="display:none"/>

    <!-- Open mouth (surprised/excited) -->
    <g class="mouth mouth--open" style="display:none">
      <path d="M 76 104 Q 90 118 104 104" stroke="#00CCFF" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="90" cy="108" rx="13" ry="7" fill="#01091A"/>
      <ellipse cx="90" cy="107" rx="9" ry="4" fill="#002233" opacity="0.8"/>
    </g>

    <!-- Frown (worried) -->
    <path class="mouth mouth--frown"
      d="M 78 111 Q 90 102 102 111"
      stroke="#0077BB" stroke-width="3.5" fill="none" stroke-linecap="round"
      style="display:none" opacity="0.8"/>

    <!-- Straight (thinking/focused) -->
    <path class="mouth mouth--straight"
      d="M 81 108 L 99 108"
      stroke="#0088AA" stroke-width="3" stroke-linecap="round"
      style="display:none" opacity="0.7"/>

    <!-- Smirk (proud) -->
    <path class="mouth mouth--smirk"
      d="M 82 108 Q 95 114 104 107"
      stroke="#00CCFF" stroke-width="3.5" fill="none" stroke-linecap="round"
      style="display:none"/>

    <!-- ══ EAR RINGS ══════════════════════════════════════ -->
    <circle cx="22"  cy="83" r="18" fill="#1155AA"/>
    <circle cx="22"  cy="83" r="13" fill="#1976D2"/>
    <circle cx="22"  cy="83" r="8"  fill="#0D47A1"/>
    <circle cx="22"  cy="83" r="4"  fill="#1565C0" opacity="0.6"/>
    <path d="M 11 77 Q 10 83 11 89" stroke="white" stroke-width="1.5" fill="none" opacity="0.25" stroke-linecap="round"/>

    <circle cx="158" cy="83" r="18" fill="#1155AA"/>
    <circle cx="158" cy="83" r="13" fill="#1976D2"/>
    <circle cx="158" cy="83" r="8"  fill="#0D47A1"/>
    <circle cx="158" cy="83" r="4"  fill="#1565C0" opacity="0.6"/>
    <path d="M 169 77 Q 170 83 169 89" stroke="white" stroke-width="1.5" fill="none" opacity="0.25" stroke-linecap="round"/>

    <!-- ══ ANTENNA ════════════════════════════════════════ -->
    <line x1="90" y1="18" x2="90" y2="34" stroke="#90A4AE" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="90" cy="34" r="5.5" fill="#78909C"/>
    <circle cx="90" cy="34" r="3.5" fill="#90A4AE"/>
    <!-- Antenna tip (teal) -->
    <circle class="antenna-tip" cx="90" cy="12" r="10" fill="#26C6DA" filter="url(#zaki-glow-sm)"/>
    <circle cx="90" cy="12" r="7"  fill="#4DD0E1"/>
    <circle cx="86" cy="8"  r="3.5" fill="white" opacity="0.5"/>

    <!-- Right arm raised for celebrating/victory -->
    <g class="arm-hang arm-hang--up" style="display:none">
      <circle cx="134" cy="158" r="9" fill="#37474F"/>
      <rect x="127" y="128" width="15" height="30" rx="7" fill="#455A64"
            transform="rotate(45 134 158)"/>
      <circle cx="148" cy="128" r="7" fill="#37474F"/>
      <rect x="144" y="106" width="13" height="24" rx="6" fill="#546E7A"
            transform="rotate(30 148 128)"/>
      <circle cx="158" cy="106" r="10" fill="#37474F"/>
    </g>

  </svg>
</template>

<script setup lang="ts">
import type { MascotMood, MascotSize } from '~/types/mascot'

const props = withDefaults(defineProps<{
  mood?: MascotMood
  size?: MascotSize
  animated?: boolean
}>(), {
  mood: 'happy',
  size: 'md',
  animated: true
})

const sizeMap: Record<MascotSize, number> = {
  xs: 48,
  sm: 64,
  md: 88,
  lg: 120,
  xl: 160
}
</script>

<style scoped>
/* ── Default: happy — normal eyes + gentle smile ──────── */
.zaki .face-eyes { display: none; }
.zaki .eyes--normal { display: block; }
.zaki .mouth { display: none; }
.zaki .mouth--smile { display: block; }
.zaki .arm-wave { display: none; }
.zaki .arm-wave--default { display: block; }
.zaki .arm-hang--up { display: none; }

/* ── excited ──────────────────────────────────────────── */
.zaki.mood-excited .eyes--normal { display: none; }
.zaki.mood-excited .eyes--wide   { display: block; }
.zaki.mood-excited .mouth--smile { display: none; }
.zaki.mood-excited .mouth--open  { display: block; }

/* ── celebrating ─────────────────────────────────────── */
.zaki.mood-celebrating .eyes--normal      { display: none; }
.zaki.mood-celebrating .eyes--arc         { display: block; }
.zaki.mood-celebrating .mouth--smile      { display: none; }
.zaki.mood-celebrating .mouth--big        { display: block; }
.zaki.mood-celebrating .arm-wave--default { display: none; }
.zaki.mood-celebrating .arm-wave--up      { display: block; }
.zaki.mood-celebrating .arm-hang--up      { display: block; }

/* ── surprised ───────────────────────────────────────── */
.zaki.mood-surprised .eyes--normal { display: none; }
.zaki.mood-surprised .eyes--wide   { display: block; }
.zaki.mood-surprised .mouth--smile { display: none; }
.zaki.mood-surprised .mouth--open  { display: block; }

/* ── sad ─────────────────────────────────────────────── */
.zaki.mood-sad .eyes--normal  { display: none; }
.zaki.mood-sad .eyes--worried { display: block; }
.zaki.mood-sad .mouth--smile  { display: none; }
.zaki.mood-sad .mouth--frown  { display: block; }

/* ── thinking ────────────────────────────────────────── */
.zaki.mood-thinking .eyes--normal  { display: none; }
.zaki.mood-thinking .eyes--squint  { display: block; }
.zaki.mood-thinking .mouth--smile  { display: none; }
.zaki.mood-thinking .mouth--straight { display: block; }

/* ── proud ───────────────────────────────────────────── */
.zaki.mood-proud .mouth--smile { display: none; }
.zaki.mood-proud .mouth--smirk { display: block; }

/* ── proud: big smile for very proud ─────────────────── */
/* (uses default normal eyes) */

/* ── encouraging: same as happy (default) ────────────── */

/* ── resting: half-lidded look via squint + smile ─────── */
.zaki.mood-resting .eyes--normal { display: none; }
.zaki.mood-resting .eyes--squint { display: block; }

/* ── victory: wink + big smile ──────────────────────── */
.zaki.mood-victory .eyes--normal  { display: none; }
.zaki.mood-victory .eyes--wink    { display: block; }
.zaki.mood-victory .mouth--smile  { display: none; }
.zaki.mood-victory .mouth--big    { display: block; }

/* ── ANIMATIONS ──────────────────────────────────────── */

/* Idle float */
.zaki--animated {
  animation: zaki-float 3s ease-in-out infinite;
  transform-origin: center bottom;
}

/* Wave arm */
.zaki--animated .arm-wave--default {
  transform-origin: 46px 158px;
  animation: zaki-wave 1.8s ease-in-out infinite;
}

/* Antenna pulse */
.zaki--animated .antenna-tip {
  animation: zaki-antenna 2s ease-in-out infinite;
}

/* Thruster flicker */
.zaki--animated .thruster-mid {
  animation: zaki-thruster 1.2s ease-in-out infinite;
}

/* Eye glow pulse */
.zaki--animated .face-eyes circle[fill="#0090D0"],
.zaki--animated .face-eyes circle[fill="#0099E8"] {
  animation: zaki-eye-pulse 2.5s ease-in-out infinite;
}

/* Celebrating: whole body dance */
.zaki--animated.mood-celebrating {
  animation: zaki-dance 0.8s ease-in-out infinite;
}

/* Excited: bounce */
.zaki--animated.mood-excited {
  animation: zaki-bounce 0.6s ease-in-out infinite;
}

/* Worried: subtle shake */
.zaki--animated.mood-sad {
  animation: zaki-shake 2s ease-in-out infinite;
}

@keyframes zaki-float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-5px); }
}
@keyframes zaki-wave {
  0%, 100% { transform: rotate(0deg); }
  30%       { transform: rotate(-20deg); }
  60%       { transform: rotate(15deg); }
}
@keyframes zaki-dance {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  25%       { transform: rotate(-6deg) translateY(-6px); }
  75%       { transform: rotate(6deg) translateY(-4px); }
}
@keyframes zaki-bounce {
  0%, 100% { transform: translateY(0) scaleY(1); }
  40%       { transform: translateY(-12px) scaleY(1.04); }
  70%       { transform: translateY(-6px) scaleY(0.97); }
}
@keyframes zaki-shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-3px); }
  40%       { transform: translateX(3px); }
  60%       { transform: translateX(-2px); }
  80%       { transform: translateX(2px); }
}
@keyframes zaki-antenna {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}
@keyframes zaki-thruster {
  0%, 100% { transform: scaleY(1);   opacity: 0.85; }
  50%       { transform: scaleY(1.2) translateY(2px); opacity: 1; }
}
@keyframes zaki-eye-pulse {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 0.65; }
}

@media (prefers-reduced-motion: reduce) {
  .zaki--animated,
  .zaki--animated * { animation: none !important; }
}
</style>
