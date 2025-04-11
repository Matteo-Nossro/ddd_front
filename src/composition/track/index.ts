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
    daily_rank:number;
    count: number;
    next?:string;
    previous?:string;
    results : Track[];

}

// Fonction pour récupérer les tracks via l’API
export async function fetchTracksByCountry(country: string, page = 1): Promise<TrackResponse> {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/musique/tracks/${country}/?page=${page}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! status : ${response.status}`);
        }
        const data = await response.json();
        return data as TrackResponse;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}

export async function fetchTopTracksByCountryAndDate(country: string, date : string): Promise<TrackResponse> {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/musique/tracks/top/${country}/${date}/`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! status : ${response.status}`);
        }
        const data = await response.json();
        return data as TrackResponse;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error;
    }
}

export function useTrack() {
    return {
        fetchTracks: fetchTracksByCountry,
        fetchTopTracksByCountryAndDate: fetchTopTracksByCountryAndDate
    }
}