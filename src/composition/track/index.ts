// Définition de l'interface Track
export interface Track {
    id: number;
    country: string;
    spotify_id: string;
    name: string;
    /**
     * Facultatif :  album_name, album_release_date, artists
     */
    artists?: string;
    daily_rank: number;
    daily_movement: number;
    weekly_movement: number;
    snapshot_date: string;
    popularity: number;
    is_explicit: boolean;
    duration_ms: number;
    album_name?: string;
    album_release_date?: string;
    danceability: number;
    energy: number;
    key: number;
    loudness: number;
    mode: number;
    speechiness: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    valence: number;
    tempo: number;
    time_signature: number;
}

interface TrackResponse{
    count: number;
    next?:string;
    previous?:string;
    results : Track[];

}

// Fonction pour récupérer les tracks via l’API
export async function fetchTracks(): Promise<TrackResponse> {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/musique/tracks/FR/?page=2");
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! status : ${response.status}`);
        }
        const data = await response.json();
        // Si l'endpoint renvoie directement un tableau de tracks
        return data as TrackResponse;

        // Si l'endpoint renvoie un objet avec la liste des tracks dans une propriété
        // return data.results as Track[];
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}

export function useTrack() {
    return {
        fetchTracks: fetchTracks
    }
}