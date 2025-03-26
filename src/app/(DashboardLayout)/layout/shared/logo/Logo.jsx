'use client'
import { useSelector } from 'react-redux';
import Link from "next/link";
import { styled } from "@mui/material/styles";
import Image from "next/image";

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const layout = useSelector((state) => state.layout);
  
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? "60px" : "180px",
    overflow: "hidden",
    display: "block",
    transition: "all 0.3s ease",
    transform: customizer.isCollapse ? "translateX(0)" : "translateX(20px)",
  }));

  const logoImage = layout === 'horizontal' 
    ? "/images/logos/resolve-logo-collapsed.png"
    : customizer.isCollapse
    ? "/images/logos/resolve-logo-collapsed.png"
    : "/images/logos/resolve-logo.png";

  if (customizer.activeDir === "ltr") {
    return (
      <LinkStyled href="/" width={180}>
        {customizer.activeMode === "dark" ? (
          <Image
            src={logoImage}
            alt="logo"
            height={60}
            width={customizer.isCollapse ? 55 : 180}
            priority
          />
        ) : (
          <Image
            src={logoImage}
            alt="logo"
            height={60}
            width={customizer.isCollapse ? 55 : 180}
            priority
          />
        )}
      </LinkStyled>
    );
  }

  

  return (
    <LinkStyled href="/" width={180}>
      {customizer.activeMode === "dark" ? (
        <Image
          src={logoImage}
          alt="logo"
          height={customizer.TopbarHeight}
          width={customizer.isCollapse ? 55 : 180}
          priority
        />
      ) : (
        <Image
          src={logoImage}
          alt="logo"
          height={customizer.TopbarHeight}
          width={customizer.isCollapse ? 55 : 180}
          priority
        />
      )}
    </LinkStyled>
  );
};

export default Logo;
