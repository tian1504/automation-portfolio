import { useState } from "react";
import Spline from "@splinetool/react-spline";

interface HeroRobotProps {
  className?: string;
  /**
   * Spline scene URL. Default is a public humanoid-robot scene from Spline community.
   * To swap to a different robot, paste any other `*.splinecode` URL from
   * spline.design/community or the 21st.dev component page.
   */
  sceneUrl?: string;
}

const DEFAULT_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * Hero mascot — 3D Spline robot rendered behind the headline.
 * Direct (non-lazy) import to avoid Spline's known forwardRef/Suspense hook issue in Vite.
 * Spline's runtime is still split into its own chunk by Vite's module graph.
 */
export const HeroRobot = ({ className = "", sceneUrl = DEFAULT_SCENE }: HeroRobotProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={className}>
      <div
        className="w-full h-full transition-opacity duration-1000"
        style={{ opacity: loaded ? 1 : 0 }}
      >
        <Spline
          scene={sceneUrl}
          onLoad={() => setLoaded(true)}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};
