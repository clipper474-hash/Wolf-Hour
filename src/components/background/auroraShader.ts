// Domain-warped fbm aurora — the Home living background.
// Slow, breathing, low-amplitude. Grain kills OLED banding.

export const AURORA_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const AURORA_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform vec3 uC1; // indigo
  uniform vec3 uC2; // violet
  uniform vec3 uC3; // magenta
  uniform vec3 uC4; // coral
  uniform vec3 uC5; // blush

  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                             + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++){
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5) * 1.8;
    float t = uTime * 0.03; // slow breathing

    // flowing domain warp — animates the aurora ribbons
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.1, 1.7) - t));
    float warp = fbm(p + 1.5 * q + t * 0.5);

    // radial mix: 0 at the warm center, 1 toward the cool edges,
    // modulated by the flowing warp so the bloom drifts
    float rad = distance(uv, vec2(0.5, 0.46));
    float m = clamp(rad * 1.28 + warp * 0.30, 0.0, 1.0);

    // luminous dusk ramp: coral center -> magenta -> violet -> indigo edges
    vec3 col = uC4;
    col = mix(col, uC3, smoothstep(0.14, 0.5, m));
    col = mix(col, uC2, smoothstep(0.45, 0.8, m));
    col = mix(col, uC1, smoothstep(0.74, 1.0, m));

    // blush highlight blooming in the core (drifts with the warp)
    col = mix(col, uC5, smoothstep(0.28, 0.0, rad) * 0.55 * (0.6 + 0.4 * warp));

    // gentle brightness + soft edge vignette
    col *= 1.06;
    col *= 1.0 - smoothstep(0.62, 1.2, distance(uv, vec2(0.5))) * 0.28;

    // grain kills OLED banding
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * 0.025;

    gl_FragColor = vec4(col, 1.0);
  }
`;
