import { useContext } from "react";
import { AnnounceContext } from "../context/AnnounceContext";

export function useAnnounce() {
  return useContext(AnnounceContext).announce;
}
