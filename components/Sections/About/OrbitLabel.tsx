import { motion, MotionValue, useTransform } from 'framer-motion'
import { Text } from '@chakra-ui/react'
import { SkillCategory } from 'config/skills'

const MotionLabel = motion(Text)

type OrbitLabelProps = {
  category: SkillCategory
  baseAngle: number
  radius: number
  verticalOffset: number
  fontSize: number
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  angle: MotionValue<number>
}

const OrbitLabel = ({
  category,
  baseAngle,
  radius,
  verticalOffset,
  fontSize,
  pointerX,
  pointerY,
  angle,
}: OrbitLabelProps) => {
  const transform = useTransform(
    [pointerX, pointerY, angle],
    ([px, py, currentAngle]: number[]) => {
      const rad = ((currentAngle + baseAngle) * Math.PI) / 180
      const x = px + radius * Math.cos(rad)
      // Centre de l'orbite décalé vers le haut (verticalOffset, calculé dans
      // SkillsOrbitTeaser.tsx à partir du rayon) : garantit que le point le
      // plus bas du cercle reste toujours au-dessus du CTA, quelle que soit
      // la position du curseur sur le bouton.
      const y = py - verticalOffset + radius * Math.sin(rad)
      return `translate(${x}px, ${y}px) translate(-50%, -50%)`
    }
  )

  return (
    <MotionLabel
      as="span"
      textStyle="label"
      fontSize={`${fontSize}px`}
      color="accent.default"
      opacity={0.85}
      position="absolute"
      top={0}
      left={0}
      whiteSpace="nowrap"
      style={{ transform }}
    >
      {category}
    </MotionLabel>
  )
}

export default OrbitLabel
