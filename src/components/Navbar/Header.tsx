import React from "react";
// import TopBar from "./TopBar";
import SearchBar from "./SearchBar";
import Container from "../Container/Container";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";
import NavMenu from "./NavMenu";
import CartIcon from "./UserAdmin/CartIcon";
import Wishlist from "./UserAdmin/Wishlist";
import AuthButtons from "./AuthButtons";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function Header({}: Props) {
  return (
    <header className="bg-white/70 py-5 sticky top-0 z-50  backdrop-blur-md">
      {/* <TopBar /> */}
      <Container className="flex items-center justify-between text-lightColor">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>
        <NavMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <Wishlist />
          <CartIcon />
          <AuthButtons />
        </div>
      </Container>
      <SearchBar />
    </header>
  );
}
