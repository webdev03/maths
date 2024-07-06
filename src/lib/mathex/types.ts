export interface NumberQuestion {
    /**
     * HTML contents
     */
    contents: string;
    /**
     * Solutions list
     */
    solutions: number[];
}

export type Question = NumberQuestion;

export interface Room {
    /**
     * Unique identity
     */
    id: string;
    /**
     * Players as a list of socket IDs
     */
    players: string[];
    /**
     * Name
     */
    name: string;
    /**
     * Questions list
     */
    questions: Question[];
};

export interface ClientKnownRoom {
    /**
     * Unique identity
     */
    id: string;
    /**
     * Player count
     */
    playerCount: number;
    /**
     * Name
     */
    name: string;
    /**
     * Questions count
     */
    questionCount: number;
};

