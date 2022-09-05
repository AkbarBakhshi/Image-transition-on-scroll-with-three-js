// ***//

// if you get errors, check the error in the chrome tools. Most probably one of the followings is causing the error:

// 1) You forgot to add ; at the end of a line

// 2) Forgot to declare the type of the variable (vec4, vc3, float, etc.)

// 3) Variable type does not match the value (float a = 1) --> float a = 1.0
// 3.1) A variabel is assigned to other variable with different type. The following will throw an error:
//                 float a = 2.0;
//                 int b = a + 3.0;

// 4) xyz and rgba need to be float numbers, so make sure that you add decimals (even 0). All of the followings will work: 
//                  2.0
//                  1.
//                  .5

//***//


// uniform type is used for the data that don't change among the vertices (are uniform)
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uScrollProgress;

// varying  type is used to make a variable available in both vertex and fragment shader files
varying vec2 vUv;

vec2 mirrored(vec2 v) {
    vec2 m = mod(v, 2.0);
    return mix(m, 2.0 - m, step(1.0, m));
}

float tri(float p) {
    return mix(p, 1.0 - p, step(0.5, p))*2.0;
}

void main() {

    float prog = uScrollProgress * 6.0 + vUv.y * 2. - vUv.x - 3.;
    prog = clamp(prog, 0.0, 1.0);

    vec2 accel = vec2(0.5, 2.);


    vec2 translateValue = uScrollProgress + prog*accel;
    vec2 translateValue1 = vec2(-0.5,1.) * translateValue;
    vec2 translateValue2 = vec2(-0.5,1.) * (translateValue - 1.0 - accel);
    vec2 w = sin( vec2(0,0.3) + vUv.yx*vec2(0,4.)) * vec2(0, 0.5);
    vec2 xy = w*(tri(uScrollProgress)*0.5 + tri(prog)*0.5);
    vec2 uv1 = vUv + translateValue1 + xy;
    vec2 uv2 = vUv + translateValue2 + xy;

    vec4 image1 = texture2D(uTexture1, mirrored(uv1));
    vec4 image2 = texture2D(uTexture2, mirrored(uv2));

    // vec4 image1 = texture2D(uTexture1, vUv);
    // vec4 image2 = texture2D(uTexture2, vUv);
    // vec4 image1 = texture2D(uTexture1, vec2(vUv.x + uScrollProgress, vUv.y + uScrollProgress));
    // vec4 image2 = texture2D(uTexture2, vec2(vUv.x + uScrollProgress - 1., vUv.y + uScrollProgress - 1.));

    // image1 = vec4(1.,0.,0.,1.);
    // image2 = vec4(0.,0.,1.,1.);

    gl_FragColor = mix(image1, image2, prog);

}