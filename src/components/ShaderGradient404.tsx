// @ts-ignore
import { useEffect, useState } from 'react'
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

export default function ShaderGradientBg() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark' || 
                document.documentElement.classList.contains('dark'))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const colors = isDark 
    ? { color1: "#00b7ff", color2: "#97c3db", color3: "#bde1b9" }
    : { color1: "#ff5005", color2: "#dbba95", color3: "#d0bce1" }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 1 }}>
      <ShaderGradientCanvas pointerEvents="none">
        <ShaderGradient
            animate="on"
            brightness={1.2}
            cAzimuthAngle={180}
            cDistance={3.6}
            cPolarAngle={90}
            cameraZoom={1}
            color1={colors.color1}
            color2={colors.color2}
            color3={colors.color3}
            envPreset="city"
            grain="on"
            lightType="3d"
            positionX={-1.4}
            positionY={0}
            positionZ={0}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.1}
            rotationX={0}
            rotationY={10}
            rotationZ={50}
            shader="defaults"
            type="plane"
            uAmplitude={1}
            uDensity={1.3}
            uFrequency={5.5}
            uSpeed={0.4}
            uStrength={4}
            uTime={0}
            wireframe={false}
            />
      </ShaderGradientCanvas>
    </div>
  )
}
