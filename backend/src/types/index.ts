import { Request, Response } from 'express';

// Player types
export interface Player {
  id: number;
  player_name: string;
  nation: string;
  position: string;
  age: number;
  matches_played: number;
  starts: number;
  minutes_played: number;
  goals: number;
  assists: number;
  penalties_scored: number;
  yellow_cards: number;
  red_cards: number;
  expected_goals: number;
  expected_assists: number;
  team: string;
  market_value?: number;
  points?: number;
  image_url?: string;
}

// Match types
export interface Match {
  id: number;
  match_date: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  result: string;
  home_xg?: number;
  away_xg?: number;
  attendance?: number;
  venue?: string;
  referee?: string;
}

// Dream Team types
export interface DreamTeam {
  id: number;
  user_id: number;
  team_name: string;
  formation: string;
  total_points: number;
  captain_id?: number;
  vice_captain_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface DreamTeamPlayer {
  id: number;
  dream_team_id: number;
  player_id: number;
  position: string;
  squad_order?: number;
  points_earned: number;
  created_at: Date;
  updated_at: Date;
  player_name?: string;
  player_position?: string;
  team?: string;
  nation?: string;
  age?: number;
  market_value?: number;
  points?: number;
  image_url?: string;
}

export interface TeamStats {
  total_points: number;
  player_count: number;
  avg_points: number;
}

export interface TeamComposition {
  position: string;
  count: number;
}

export interface UpdateDreamTeamData {
  teamName?: string;
  formation?: string;
  captainId?: number;
  viceCaptainId?: number;
}

export interface UpdatePlayerData {
  position?: string;
  squadOrder?: number;
}
