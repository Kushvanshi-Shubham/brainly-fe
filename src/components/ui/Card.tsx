import axios from "axios";
import { BACKEND_URL } from "../../config";
import { DeleteIcon, ShareIcon } from "../../Icons/IconsImport";


interface CardProps {
  contentId?: string;
  title: string;
  link: string;
  type: string;
  refresh: () => void;
}

export function Card(props: CardProps) {
  const embedLink =
    props.type === "youtube"
      ? props.link.replace("watch", "embed").replace("?v=", "/")
      : props.link.replace("x.com", "twitter.com");

  async function handleDelete() {
    const confirmDelete = window.confirm("Are you sure you want to delete this content?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content/${props.contentId}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      props.refresh();
    } catch (err) {
      alert("Failed to delete. Please try again.");
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md w-full max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
          {props.type}
        </span>
        <div className="flex gap-3 items-center">
          <a href={props.link} target="_blank" rel="noopener noreferrer">
            <ShareIcon size="md" />
          </a>
          <div
            onClick={handleDelete}
            className="cursor-pointer text-red-500 hover:text-red-700"
            title="Delete"
          >
            <DeleteIcon />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 mb-3">
        {props.title}
      </h3>

      <div className="rounded overflow-hidden">
        {props.type === "youtube" && (
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full rounded"
              src={embedLink}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {props.type === "twitter" && (
          <blockquote className="twitter-tweet">
            <a href={embedLink}></a>
          </blockquote>
        )}
      </div>
    </div>
  );
}
