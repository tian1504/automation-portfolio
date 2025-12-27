import "./GlitchText.css";

const GlitchText = ({ children, speed = 1, enableShadows = true, enableOnHover = true, className = "" }) => {
  const inlineStyles = {
    "--after-duration": `${speed * 3}s`,
    "--before-duration": `${speed * 2}s`,
    // cyan + yellow instead of cyan + red
    "--after-shadow": enableShadows ? "-5px 0 #facc15" : "none", // yellow
    "--before-shadow": enableShadows ? "5px 0 cyan" : "none",
  };

  const hoverClass = enableOnHover ? "enable-on-hover" : "";

  return (
    <div className={`glitch ${hoverClass} ${className}`} style={inlineStyles} data-text={children}>
      {children}
    </div>
  );
};

export default GlitchText;
