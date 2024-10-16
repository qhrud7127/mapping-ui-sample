import { useContext } from 'react';
import {storageContext} from "../context/storage/storage-context.tsx";

export const useStorage = () => useContext(storageContext);
