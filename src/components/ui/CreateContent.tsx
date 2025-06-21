import { useRef, useState } from "react";
import { CrossIcon } from "../../Icons/CrossIcon";
import { Button } from "./button";
import { Input } from "./Input";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { motion } from "framer-motion";

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
}

export function CreateContentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}){
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentType.Youtube);
  const [loading, setLoading] = useState(false);

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    if (!title || !link) {
      alert("Title and link are required");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/content`,
        { link, type, title },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      onClose();
    } catch (err) {
      alert("Failed to add content");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-50">
          <div className="absolute w-full h-full bg-black opacity-50 z-10" />

          <motion.div
            className="relative z-20 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-end mb-2">
              <div
                onClick={onClose}
                className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-white"
              >
                <CrossIcon />
              </div>
            </div>

            <Input reference={titleRef} placeholder={"Title"} />
            <Input reference={linkRef} placeholder={"Link"} />

            <div className="px-3 py-2 rounded m-2 flex gap-2 text-gray-500 dark:text-gray-300">
              Type
              <Button
                text="Youtube"
                size="sm"
                variant={type === ContentType.Youtube ? "primary" : "secondary"}
                onClick={() => setType(ContentType.Youtube)}
              />
              <Button
                text="Twitter"
                size="sm"
                variant={type === ContentType.Twitter ? "primary" : "secondary"}
                onClick={() => setType(ContentType.Twitter)}
              />
            </div>

            <div className="flex justify-center py-2">
              <Button
                variant="primary"
                text={loading ? "Submitting..." : "Submit"}
                size="md"
                onClick={addContent}
                loading={loading}
              />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
