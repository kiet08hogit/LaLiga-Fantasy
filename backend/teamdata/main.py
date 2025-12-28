"""
La Liga Fantasy Data Processing
Consolidates all data scraping, processing, and analysis functions
"""

import os
import pandas as pd
import numpy as np

# Set data folder path
DATA_FOLDER = os.path.join(os.path.dirname(__file__), 'laliga_dataset')

# Ensure data folder exists
os.makedirs(DATA_FOLDER, exist_ok=True)


# ============================================================================
# DATA PROCESSING FUNCTIONS
# ============================================================================

def fix_date_format(input_file="LaLigaMatch_24-25.csv", output_file="LaLigaMatch_24-25_fixed.csv"):
    """Convert date format from DD/MM/YY to MM/DD/YYYY"""
    print(f"\nFixing date format in {input_file}...")
    
    input_path = os.path.join(DATA_FOLDER, input_file)
    output_path = os.path.join(DATA_FOLDER, output_file)
    
    df = pd.read_csv(input_path)
    
    # Parse DD/MM/YY correctly
    df["Date"] = pd.to_datetime(df["Date"], dayfirst=True)
    
    # Convert to MM/DD/YYYY format
    df["Date"] = df["Date"].dt.strftime("%m/%d/%Y")
    
    df.to_csv(output_path, index=False)
    print(f"✓ Fixed dates saved to: {output_file}")


def aggregate_player_stats(input_file="playerstats24-25.csv", output_file="playerstats24-25_season_totals.csv"):
    """Aggregate per-game player stats into season totals"""
    print(f"\nAggregating player stats from {input_file}...")
    
    input_path = os.path.join(DATA_FOLDER, input_file)
    output_path = os.path.join(DATA_FOLDER, output_file)
    
    # Read the raw per-game stats
    df = pd.read_csv(input_path)
    
    # Columns that should be summed (totals)
    sum_columns = [
        'Minutes', 'Goals', 'Assists', 'Penalty Shoot on Goal', 'Penalty Shoot',
        'Total Shoot', 'Shoot on Target', 'Yellow Cards', 'Red Cards', 'Touches',
        'Dribbles', 'Tackles', 'Blocks', 'Shot-Creating Actions', 'Goal-Creating Actions',
        'Passes Completed', 'Passes Attempted', 'Progressive Passes', 'Carries',
        'Progressive Carries', 'Dribble Attempts', 'Successful Dribbles'
    ]
    
    # Columns that should be averaged (per-game averages)
    avg_columns = [
        'Expected Goals (xG)', 'Non-Penalty xG (npxG)', 'Expected Assists (xAG)'
    ]
    
    # Columns to keep from first occurrence (player info)
    first_columns = ['Team', '#', 'Nation', 'Position', 'Age']
    
    # Group by Player
    aggregated = df.groupby('Player').agg({
        **{col: 'sum' for col in sum_columns if col in df.columns},
        **{col: 'mean' for col in avg_columns if col in df.columns},
        **{col: 'first' for col in first_columns if col in df.columns}
    })
    
    # Calculate matches played (number of rows per player)
    matches_played = df.groupby('Player').size()
    aggregated['Matches'] = matches_played
    
    # Calculate additional stats
    aggregated['Starts'] = df.groupby('Player').apply(lambda x: (x['Minutes'] > 0).sum())
    
    # Calculate per-90 minute stats for key metrics
    for col in ['Goals', 'Assists', 'Expected Goals (xG)', 'Non-Penalty xG (npxG)',
                'Expected Assists (xAG)', 'Shot-Creating Actions', 'Goal-Creating Actions', 'Tackles', 'Blocks']:
        if col in aggregated.columns:
            aggregated[f'{col} per 90'] = (aggregated[col] / (aggregated['Minutes'] / 90)).round(2)
    
    # Reorder columns for better readability
    column_order = [
        'Team', '#', 'Nation', 'Position', 'Age', 'Matches', 'Starts', 'Minutes',
        'Goals', 'Assists', 'Penalty Shoot', 'Total Shoot', 'Shoot on Target',
        'Expected Goals (xG)', 'Non-Penalty xG (npxG)', 'Expected Assists (xAG)',
        'Yellow Cards', 'Red Cards',
        'Touches', 'Dribbles', 'Tackles', 'Blocks',
        'Shot-Creating Actions', 'Goal-Creating Actions',
        'Passes Completed', 'Passes Attempted',
        'Progressive Passes', 'Carries', 'Progressive Carries',
        'Dribble Attempts', 'Successful Dribbles'
    ]
    
    # Keep only columns that exist
    column_order = [col for col in column_order if col in aggregated.columns]
    aggregated = aggregated[column_order]
    
    # Sort by Minutes played (descending)
    aggregated = aggregated.sort_values('Minutes', ascending=False)
    
    # Save to CSV
    aggregated.to_csv(output_path)
    print(f"✓ Aggregated season stats saved to: {output_file}")
    print(f"Total unique players: {len(aggregated)}")
    
    return aggregated


def view_match_data(csv_file="LaLigaMatch_24-25.csv"):
    """Load and display La Liga match data"""
    print("\n" + "="*80)
    print("LA LIGA 2024/25 MATCHES")
    print("="*80)
    
    csv_path = os.path.join(DATA_FOLDER, csv_file)
    matches = pd.read_csv(csv_path)
    
    print(f"\n✓ La Liga 2024/25 Matches Loaded!")
    print(f"Total matches: {len(matches)}")
    
    print("\nFirst 5 matches:")
    print(matches.head())
    
    print("\nColumn names:")
    for i, col in enumerate(matches.columns, 1):
        print(f"  {i}. {col}")
    
    print("\nData info:")
    print(matches.info())
    
    print("\nBasic statistics:")
    print(matches[['FTHG', 'FTAG', 'HS', 'AS', 'HST', 'AST']].describe())


def view_player_stats(csv_file="playerstats24-25.csv"):
    """Display player statistics summary"""
    print("\n" + "="*80)
    print("LA LIGA PLAYER STATISTICS 2024/25")
    print("="*80)
    
    csv_path = os.path.join(DATA_FOLDER, csv_file)
    players_df = pd.read_csv(csv_path)
    
    print(f"\n✓ Total players: {len(players_df)}")
    print(f"✓ Total columns: {len(players_df.columns)}")
    
    print("\nColumn names:")
    for i, col in enumerate(players_df.columns, 1):
        print(f"  {i}. {col}")
    
    print("\n" + "="*80)
    print("FIRST 10 PLAYERS")
    print("="*80)
    print(players_df[['Player', 'Team', 'Position', 'Goals', 'Assists', 'Minutes']].head(10).to_string())
    
    print("\n" + "="*80)
    print("TOP 10 GOAL SCORERS")
    print("="*80)
    top_scorers = players_df.nlargest(10, 'Goals')[['Player', 'Team', 'Position', 'Goals', 'Assists', 'Minutes']]
    print(top_scorers.to_string())
    
    print("\n" + "="*80)
    print("TOP 10 ASSIST LEADERS")
    print("="*80)
    top_assists = players_df.nlargest(10, 'Assists')[['Player', 'Team', 'Position', 'Goals', 'Assists', 'Minutes']]
    print(top_assists.to_string())
    
    print("\n" + "="*80)
    print("PLAYERS BY POSITION")
    print("="*80)
    position_counts = players_df['Position'].value_counts()
    print(position_counts)
    
    print("\n" + "="*80)
    print("PLAYERS BY TEAM")
    print("="*80)
    team_counts = players_df['Team'].value_counts()
    print(team_counts)


def view_season_totals(csv_file="playerstats24-25_season_totals.csv"):
    """Display aggregated season stats"""
    print("\n" + "="*80)
    print("LA LIGA PLAYER SEASON TOTALS 2024/25")
    print("="*80)
    
    csv_path = os.path.join(DATA_FOLDER, csv_file)
    df = pd.read_csv(csv_path)
    
    print(f"\n✓ Total unique players: {len(df)}")
    print(f"✓ Total columns: {len(df.columns)}")
    
    print("\nTop 15 players by minutes played:")
    print(df[['Player', 'Team', 'Position', 'Matches', 'Minutes', 'Goals', 'Assists']].head(15).to_string())
    
    print("\n" + "="*80)
    print("TOP 10 GOAL SCORERS (SEASON TOTALS)")
    print("="*80)
    top_scorers = df.nlargest(10, 'Goals')[['Player', 'Team', 'Position', 'Matches', 'Goals', 'Assists', 'Minutes']]
    print(top_scorers.to_string())
    
    print("\n" + "="*80)
    print("TOP 10 ASSIST LEADERS (SEASON TOTALS)")
    print("="*80)
    top_assists = df.nlargest(10, 'Assists')[['Player', 'Team', 'Position', 'Matches', 'Goals', 'Assists', 'Minutes']]
    print(top_assists.to_string())


# ============================================================================
# MAIN MENU
# ============================================================================

def show_menu():
    """Display interactive menu"""
    print("\n" + "="*80)
    print("LA LIGA FANTASY DATA PROCESSOR")
    print("="*80)
    print("\nSelect an option:")
    print("  1. Fix match date format")
    print("  2. Aggregate player stats to season totals")
    print("  3. View match data")
    print("  4. View player per-game stats")
    print("  5. View season totals")
    print("  6. Run all data processing")
    print("  0. Exit")
    print("-"*80)


def main():
    """Main entry point"""
    while True:
        show_menu()
        choice = input("\nEnter your choice (0-6): ").strip()
        
        if choice == "1":
            fix_date_format()
        
        elif choice == "2":
            aggregate_player_stats()
        
        elif choice == "3":
            view_match_data()
        
        elif choice == "4":
            view_player_stats()
        
        elif choice == "5":
            view_season_totals()
        
        elif choice == "6":
            print("\nRunning all data processing...")
            fix_date_format()
            aggregate_player_stats()
            view_season_totals()
        
        elif choice == "0":
            print("\n✓ Exiting...")
            break
        
        else:
            print("\n✗ Invalid choice. Please try again.")


if __name__ == "__main__":
    main()
