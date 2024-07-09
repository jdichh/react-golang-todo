import { Box, Button, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box bg={useColorModeValue("gray.300", "gray.700")} className="rounded-md m-2 transition">
      <nav className="flex gap-2 p-4 justify-between items-center">
        <h1 className="font-semibold">
          GoTaskYourself
        </h1>
        <Button onClick={toggleColorMode} className="hover:scale-105 active:scale-95">
            {colorMode === "light" ? <MdLightMode /> : <MdDarkMode />}
        </Button>
      </nav>
    </Box>
  );
};

export default Navbar;
