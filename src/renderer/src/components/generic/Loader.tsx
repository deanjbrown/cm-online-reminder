import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router";

const Loader: React.FC<{ message?: string }> = ({ message = "Loading" }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col gap-6 w-screen h-screen items-center justify-center">
        <p className="text-lg text-white font-medium text-center">{message}</p>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        >
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </motion.div>
        <Button onClick={() => navigate(-1)}>
          <MdArrowBackIos /> Cancel
        </Button>
      </div>
    </>
  );
};

export default Loader;
