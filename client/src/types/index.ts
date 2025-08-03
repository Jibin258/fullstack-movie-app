export interface Entry {
    id: number;
    title: string;
    type: "Movie" | "TV Show";
    director: string;
    budget: number;
    location: string;
    duration: string;
    yearOrTime: string;
    createdAt?: string;
    updatedAt?: string;
}
