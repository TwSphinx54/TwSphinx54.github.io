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
    ? { color1: "#13d249", color2: "#0000e8", color3: "#00aeff" }
    : { color1: "#ff7a33", color2: "#33a0ff", color3: "#ffc53d" }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1}}>
      <ShaderGradientCanvas pointerEvents="none">
        <ShaderGradient
            animate="on"
            brightness={1.5}
            cAzimuthAngle={330}
            cDistance={10}
            cPolarAngle={100}
            cameraZoom={4.58}
            color1={colors.color1}
            color2={colors.color2}
            color3={colors.color3}
            envPreset="dawn"
            grain="off"
            lightType="3d"
            positionX={2}
            positionY={-1.2}
            positionZ={0}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.1}
            rotationX={0}
            rotationY={0}
            rotationZ={-40}
            shader="defaults"
            type="sphere"
            uAmplitude={1.4}
            uDensity={1.1}
            uFrequency={5.5}
            uSpeed={0.1}
            uStrength={0.4}
            uTime={0}
            wireframe={false}
            zoomOut={false}
            />
      </ShaderGradientCanvas>
    </div>
  )
}
