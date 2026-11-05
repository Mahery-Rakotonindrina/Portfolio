import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron } from '@react-three/drei'
import type { Mesh } from 'three'

// Rotation autonome lente (rad/s) + offset additif piloté par la position du
// pointeur, desktop uniquement (US-019 / DESIGN_PROPOSAL_V2 §7). `state.mouse`
// est fourni nativement par @react-three/fiber (position normalisée -1 à 1
// du pointeur sur le canvas) — aucun listener `window` custom, et surtout
// aucune lecture d'accéléromètre/gyroscope : ce mécanisme ne demande jamais
// de permission capteur, y compris sur mobile.
const AUTO_ROTATION_X = 0.08
const AUTO_ROTATION_Y = 0.14
const MOUSE_OFFSET_STRENGTH = 0.5

export type WireframeShapeProps = {
  color: string
  interactive: boolean
}

const WireframeShape = ({ color, interactive }: WireframeShapeProps) => {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    const mesh = meshRef.current
    if (!mesh) {
      return
    }

    mesh.rotation.x += delta * AUTO_ROTATION_X
    mesh.rotation.y += delta * AUTO_ROTATION_Y

    if (interactive) {
      // Offset additif ("pousse" la rotation), jamais un contrôle direct :
      // la forme relâche vers la rotation idle dès que le pointeur s'arrête.
      mesh.rotation.y += state.mouse.x * delta * MOUSE_OFFSET_STRENGTH
      mesh.rotation.x -= state.mouse.y * delta * MOUSE_OFFSET_STRENGTH
    }
  })

  return (
    <Icosahedron ref={meshRef} args={[1.6, 1]}>
      <meshBasicMaterial color={color} wireframe />
    </Icosahedron>
  )
}

export default WireframeShape
