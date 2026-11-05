import { Canvas } from '@react-three/fiber'
import WireframeShape from './WireframeShape'

export type ContactSceneProps = {
  color: string
  interactive: boolean
}

// Scène de clôture (US-019) : unique pièce 3D du site (DESIGN_PROPOSAL_V2
// §7), forme filaire minimaliste — pas de néon ni de particules. Ce module
// n'est jamais importé statiquement : l'appelant (GetInTouch/index.tsx) le
// charge via next/dynamic(..., { ssr: false }) et ne le monte que lorsque la
// section Contact entre dans le viewport.
const ContactScene = ({ color, interactive }: ContactSceneProps) => (
  <Canvas
    camera={{ position: [0, 0, 5], fov: 45 }}
    dpr={[1, 1.5]}
    gl={{ alpha: true, antialias: true }}
    style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
  >
    <WireframeShape color={color} interactive={interactive} />
  </Canvas>
)

export default ContactScene
