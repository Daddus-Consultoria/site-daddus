import { LibraryAPIService } from "@/lib/services/library/libraryAPIService";
import LibraryRepository from "@/lib/repositories/LibraryRepository";

let libraryRepository: LibraryRepository;

libraryRepository = new LibraryAPIService();

export { libraryRepository };
