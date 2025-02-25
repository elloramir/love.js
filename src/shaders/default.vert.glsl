attribute vec2 a_position;
attribute vec2 a_texcoords;
attribute vec4 a_color;

varying vec2 v_texcoords;
varying vec4 v_color;

uniform mat4 u_proj;

void main() {
    gl_Position = u_proj * vec4(a_position, 0.0, 1.0);
    v_texcoords = a_texcoords;
    v_color = a_color;
}