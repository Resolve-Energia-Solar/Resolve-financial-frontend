'use client'
import { useSelector } from 'react-redux';
import Link from "next/link";
import { styled } from "@mui/material/styles";
import Image from "next/image";

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? "180px" : "180px",
    overflow: "hidden",
    display: "block",
  }));

  if (customizer.activeDir === "ltr") {
    return (
      <LinkStyled href="/" width={180}>
        {customizer.activeMode === "dark" ? (
          <Image
            src="/images/logos/resolve-logo.png"
            alt="logo"
            height={60}
            width={180}
            priority
          />
        ) : (
          <Image
            src={"/images/logos/resolve-logo.png"}
            alt="logo"
            height={60}
            width={180}
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
          src="/images/logos/dark-rtl-logo.svg"
          alt="logo"
          height={customizer.TopbarHeight}
          width={174}
          priority
        />
      ) : (
        <Image
          src="/images/logos/light-logo-rtl.svg"
          alt="logo"
          height={customizer.TopbarHeight}
          width={174}
          priority
        />
      )}
    </LinkStyled>
  );
};

export default Logo;
