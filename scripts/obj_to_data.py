#!/usr/bin/env python3
"""
Convert a Wavefront .obj file into the same
`{x,y,z}` vertices / index-array faces format
used in the Tsoding x/z demo.

Usage:
    python3 obj_to_js.py model.obj > model_data.js
"""
import sys

def parse_obj(path):
    verts = []
    faces = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line.startswith("v "):
                _, x, y, z = line.split()[:4]
                verts.append((float(x), float(y), float(z)))
            elif line.startswith("f "):
                # each token can be "v", "v/vt", "v/vt/vn", or "v//vn"
                idx = []
                for tok in line.split()[1:]:
                    vi = tok.split("/")[0]
                    idx.append(int(vi) - 1)  # obj indices are 1-based
                faces.append(idx)
    return verts, faces

def main():
    if len(sys.argv) != 2:
        print("usage: obj_to_js.py model.obj", file=sys.stderr)
        sys.exit(1)

    verts, faces = parse_obj(sys.argv[1])

    print("const vertices = [")
    print(",\n".join(
        f"    {{ x: {x:.4f}, y: {y:.4f}, z: {z:.4f} }}" for x, y, z in verts
    ))
    print("];\n")

    print("const faces = [")
    print(",\n".join(
        "    [" + ", ".join(str(i) for i in f) + "]" for f in faces
    ))
    print("];")

if __name__ == "__main__":
    main()