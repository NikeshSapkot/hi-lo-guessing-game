/**
 * Hi-Lo Number Guessing Game - Java Implementation
 * 
 * A comprehensive implementation of the classic Hi-Lo guessing game with
 * additional features like statistics tracking, difficulty levels, and
 * multiple game modes.
 * 
 * @author Nikesh Sapkota & Prashant Basyal
 * @version 2.0
 * @since 2025-01-11
 */

import java.util.*;
import java.util.stream.Collectors;

/**
 * Main game class that handles the core Hi-Lo game logic
 */
public class HiLoGame {
    private Scanner scanner;
    private Random random;
    private GameStatistics stats;
    private int minRange;
    private int maxRange;
    private int targetNumber;
    private int attempts;
    private boolean gameActive;
    
    // Game difficulty levels
    public enum Difficulty {
        EASY(1, 50, "Easy (1-50)"),
        MEDIUM(1, 100, "Medium (1-100)"),
        HARD(1, 1000, "Hard (1-1000)"),
        EXPERT(1, 10000, "Expert (1-10000)");
        
        private final int min;
        private final int max;
        private final String description;
        
        Difficulty(int min, int max, String description) {
            this.min = min;
            this.max = max;
            this.description = description;
        }
        
        public int getMin() { return min; }
        public int getMax() { return max; }
        public String getDescription() { return description; }
        public int getOptimalGuesses() { 
            return (int) Math.ceil(Math.log(max - min + 1) / Math.log(2)); 
        }
    }
    
    /**
     * Constructor initializes the game components
     */
    public HiLoGame() {
        this.scanner = new Scanner(System.in);
        this.random = new Random();
        this.stats = new GameStatistics();
        this.gameActive = false;
        setDifficulty(Difficulty.MEDIUM); // Default difficulty
    }
    
    /**
     * Main game loop
     */
    public void startGame() {
        displayWelcome();
        
        boolean playAgain = true;
        while (playAgain) {
            displayMenu();
            int choice = getValidInput(1, 6, "Enter your choice: ");
            
            switch (choice) {
                case 1:
                    playStandardGame();
                    break;
                case 2:
                    playTimedGame();
                    break;
                case 3:
                    changeDifficulty();
                    break;
                case 4:
                    stats.displayStatistics();
                    break;
                case 5:
                    displayHelp();
                    break;
                case 6:
                    playAgain = false;
                    break;
            }
            
            if (playAgain && choice <= 2) {
                playAgain = askPlayAgain();
            }
        }
        
        displayGoodbye();
    }
    
    /**
     * Standard Hi-Lo game mode
     */
    private void playStandardGame() {
        initializeGame();
        
        System.out.println("\n🎯 STANDARD GAME MODE");
        System.out.println("Range: " + minRange + " to " + maxRange);
        System.out.println("Optimal guesses: " + getCurrentDifficulty().getOptimalGuesses());
        System.out.println("Enter 0 to quit the current game.\n");
        
        while (gameActive) {
            int guess = getValidInput(0, maxRange, 
                "Attempt #" + (attempts + 1) + " - Enter your guess: ");
            
            if (guess == 0) {
                System.out.println("💔 Game quit! The number was " + targetNumber);
                stats.recordGame(false, attempts, getCurrentDifficulty());
                break;
            }
            
            attempts++;
            GameResult result = processGuess(guess);
            displayFeedback(result, guess);
            
            if (result == GameResult.CORRECT) {
                gameActive = false;
                stats.recordGame(true, attempts, getCurrentDifficulty());
                displayVictory();
            }
        }
    }
    
    /**
     * Timed game mode with time pressure
     */
    private void playTimedGame() {
        initializeGame();
        
        System.out.println("\n⏰ TIMED GAME MODE");
        System.out.println("You have 60 seconds to guess the number!");
        System.out.println("Range: " + minRange + " to " + maxRange);
        System.out.println("Enter 0 to quit.\n");
        
        long startTime = System.currentTimeMillis();
        long timeLimit = 60000; // 60 seconds
        
        while (gameActive) {
            long elapsed = System.currentTimeMillis() - startTime;
            long remaining = (timeLimit - elapsed) / 1000;
            
            if (remaining <= 0) {
                System.out.println("\n⏰ Time's up! The number was " + targetNumber);
                stats.recordGame(false, attempts, getCurrentDifficulty());
                break;
            }
            
            int guess = getValidInput(0, maxRange, 
                "Time left: " + remaining + "s | Attempt #" + (attempts + 1) + " - Guess: ");
            
            if (guess == 0) {
                System.out.println("💔 Game quit! The number was " + targetNumber);
                stats.recordGame(false, attempts, getCurrentDifficulty());
                break;
            }
            
            attempts++;
            GameResult result = processGuess(guess);
            displayFeedback(result, guess);
            
            if (result == GameResult.CORRECT) {
                gameActive = false;
                long finalTime = (System.currentTimeMillis() - startTime) / 1000;
                stats.recordGame(true, attempts, getCurrentDifficulty());
                System.out.println("🎉 Amazing! You won in " + finalTime + " seconds!");
                displayVictory();
            }
        }
    }
    
    /**
     * Process a guess and return the result
     */
    private GameResult processGuess(int guess) {
        if (guess == targetNumber) {
            return GameResult.CORRECT;
        } else if (guess < targetNumber) {
            return GameResult.TOO_LOW;
        } else {
            return GameResult.TOO_HIGH;
        }
    }
    
    /**
     * Display feedback based on the guess result
     */
    private void displayFeedback(GameResult result, int guess) {
        switch (result) {
            case TOO_LOW:
                int lowDiff = targetNumber - guess;
                System.out.println(getHint(lowDiff) + "📈 Too low! Try higher.");
                break;
            case TOO_HIGH:
                int highDiff = guess - targetNumber;
                System.out.println(getHint(highDiff) + "📉 Too high! Try lower.");
                break;
            case CORRECT:
                // Handled in calling method
                break;
        }
    }
    
    /**
     * Generate helpful hints based on how close the guess is
     */
    private String getHint(int difference) {
        int range = maxRange - minRange;
        double percentage = (double) difference / range;
        
        if (percentage > 0.5) return "🔥 Very ";
        else if (percentage > 0.25) return "🎯 Pretty ";
        else if (percentage > 0.1) return "🎪 Getting ";
        else return "🎊 Very ";
    }
    
    /**
     * Initialize a new game
     */
    private void initializeGame() {
        this.targetNumber = random.nextInt(maxRange - minRange + 1) + minRange;
        this.attempts = 0;
        this.gameActive = true;
        
        // Debug mode (uncomment for testing)
        // System.out.println("DEBUG: Target number is " + targetNumber);
    }
    
    /**
     * Change game difficulty
     */
    private void changeDifficulty() {
        System.out.println("\n🎚️  SELECT DIFFICULTY LEVEL:");
        System.out.println("1. " + Difficulty.EASY.getDescription());
        System.out.println("2. " + Difficulty.MEDIUM.getDescription());
        System.out.println("3. " + Difficulty.HARD.getDescription());
        System.out.println("4. " + Difficulty.EXPERT.getDescription());
        
        int choice = getValidInput(1, 4, "Select difficulty: ");
        Difficulty newDifficulty = Difficulty.values()[choice - 1];
        setDifficulty(newDifficulty);
        
        System.out.println("✅ Difficulty set to: " + newDifficulty.getDescription());
    }
    
    /**
     * Set the game difficulty
     */
    private void setDifficulty(Difficulty difficulty) {
        this.minRange = difficulty.getMin();
        this.maxRange = difficulty.getMax();
    }
    
    /**
     * Get current difficulty level
     */
    private Difficulty getCurrentDifficulty() {
        for (Difficulty d : Difficulty.values()) {
            if (d.getMin() == minRange && d.getMax() == maxRange) {
                return d;
            }
        }
        return Difficulty.MEDIUM; // fallback
    }
    
    /**
     * Get valid input within a specified range
     */
    private int getValidInput(int min, int max, String prompt) {
        while (true) {
            System.out.print(prompt);
            try {
                int input = scanner.nextInt();
                if (input >= min && input <= max) {
                    return input;
                } else {
                    System.out.println("❌ Please enter a number between " + min + " and " + max);
                }
            } catch (InputMismatchException e) {
                System.out.println("❌ Please enter a valid number!");
                scanner.next(); // Clear invalid input
            }
        }
    }
    
    /**
     * Ask if player wants to play again
     */
    private boolean askPlayAgain() {
        System.out.print("\n🔄 Play another game? (y/n): ");
        String response = scanner.next().toLowerCase();
        return response.startsWith("y");
    }
    
    /**
     * Display welcome message
     */
    private void displayWelcome() {
        System.out.println("╔════════════════════════════════════════╗");
        System.out.println("║          🎯 HI-LO CHALLENGE 🎯        ║");
        System.out.println("║                                        ║");
        System.out.println("║    A Modern Number Guessing Game       ║");
        System.out.println("║   by Nikesh Sapkota & Prashant Basyal ║");
        System.out.println("╚════════════════════════════════════════╝");
        System.out.println();
    }
    
    /**
     * Display main menu
     */
    private void displayMenu() {
        System.out.println("\n🎮 GAME MENU:");
        System.out.println("1. 🎯 Play Standard Game");
        System.out.println("2. ⏰ Play Timed Game (60 seconds)");
        System.out.println("3. 🎚️  Change Difficulty");
        System.out.println("4. 📊 View Statistics");
        System.out.println("5. ❓ Help");
        System.out.println("6. 👋 Quit");
    }
    
    /**
     * Display victory message
     */
    private void displayVictory() {
        String[] celebrations = {
            "🎉 Congratulations!",
            "🎊 Well done!",
            "🏆 Excellent!",
            "🎈 Fantastic!",
            "⭐ Amazing!"
        };
        
        String celebration = celebrations[random.nextInt(celebrations.length)];
        Difficulty difficulty = getCurrentDifficulty();
        int optimal = difficulty.getOptimalGuesses();
        
        System.out.println("\n" + celebration);
        System.out.println("🎯 You guessed " + targetNumber + " in " + attempts + " attempts!");
        
        if (attempts <= optimal) {
            System.out.println("🏅 Perfect! You used the optimal strategy!");
        } else if (attempts <= optimal + 2) {
            System.out.println("👍 Great job! Very close to optimal!");
        } else {
            System.out.println("💡 Tip: Try using binary search strategy for better results!");
        }
        
        // Display efficiency rating
        double efficiency = (double) optimal / attempts * 100;
        System.out.printf("📈 Efficiency: %.1f%%\n", efficiency);
    }
    
    /**
     * Display help information
     */
    private void displayHelp() {
        System.out.println("\n📖 HOW TO PLAY:");
        System.out.println("• The computer thinks of a number in the chosen range");
        System.out.println("• You try to guess the number");
        System.out.println("• After each guess, you'll get a hint:");
        System.out.println("  - 'Too high' means guess a lower number");
        System.out.println("  - 'Too low' means guess a higher number");
        System.out.println("• Enter 0 during gameplay to quit");
        System.out.println();
        System.out.println("💡 STRATEGY TIP:");
        System.out.println("Use binary search! Always guess the middle of the remaining range.");
        System.out.println("This guarantees finding the answer in log₂(n) guesses or less!");
        System.out.println();
        System.out.println("🎯 DIFFICULTY LEVELS:");
        for (Difficulty d : Difficulty.values()) {
            System.out.println("• " + d.getDescription() + 
                " (Optimal: " + d.getOptimalGuesses() + " guesses)");
        }
    }
    
    /**
     * Display goodbye message
     */
    private void displayGoodbye() {
        System.out.println("\n🎊 Thanks for playing Hi-Lo Challenge!");
        stats.displayFinalSummary();
        System.out.println("👋 See you next time!");
    }
    
    /**
     * Game result enumeration
     */
    private enum GameResult {
        TOO_LOW, TOO_HIGH, CORRECT
    }
    
    /**
     * Statistics tracking class
     */
    private class GameStatistics {
        private int totalGames;
        private int gamesWon;
        private int totalGuesses;
        private int bestScore;
        private int worstScore;
        private List<Integer> recentScores;
        private Map<Difficulty, Integer> difficultyWins;
        private Map<Difficulty, Integer> difficultyPlayed;
        
        public GameStatistics() {
            this.totalGames = 0;
            this.gamesWon = 0;
            this.totalGuesses = 0;
            this.bestScore = Integer.MAX_VALUE;
            this.worstScore = 0;
            this.recentScores = new ArrayList<>();
            this.difficultyWins = new EnumMap<>(Difficulty.class);
            this.difficultyPlayed = new EnumMap<>(Difficulty.class);
            
            // Initialize difficulty maps
            for (Difficulty d : Difficulty.values()) {
                difficultyWins.put(d, 0);
                difficultyPlayed.put(d, 0);
            }
        }
        
        public void recordGame(boolean won, int guesses, Difficulty difficulty) {
            totalGames++;
            difficultyPlayed.put(difficulty, difficultyPlayed.get(difficulty) + 1);
            
            if (won) {
                gamesWon++;
                totalGuesses += guesses;
                difficultyWins.put(difficulty, difficultyWins.get(difficulty) + 1);
                
                if (guesses < bestScore) bestScore = guesses;
                if (guesses > worstScore) worstScore = guesses;
                
                recentScores.add(guesses);
                if (recentScores.size() > 10) {
                    recentScores.remove(0); // Keep only last 10 scores
                }
            }
        }
        
        public void displayStatistics() {
            System.out.println("\n📊 GAME STATISTICS:");
            System.out.println("═══════════════════");
            
            if (totalGames == 0) {
                System.out.println("No games played yet! Start playing to see your stats.");
                return;
            }
            
            double winRate = (double) gamesWon / totalGames * 100;
            double avgGuesses = gamesWon > 0 ? (double) totalGuesses / gamesWon : 0;
            
            System.out.println("🎮 Games Played: " + totalGames);
            System.out.println("🏆 Games Won: " + gamesWon);
            System.out.printf("📈 Win Rate: %.1f%%\n", winRate);
            
            if (gamesWon > 0) {
                System.out.printf("🎯 Average Guesses: %.1f\n", avgGuesses);
                System.out.println("🥇 Best Score: " + bestScore + " guesses");
                System.out.println("😅 Worst Score: " + worstScore + " guesses");
                
                // Recent performance trend
                if (recentScores.size() >= 3) {
                    double recentAvg = recentScores.stream().mapToInt(Integer::intValue).average().orElse(0);
                    System.out.printf("📊 Recent Average: %.1f (last %d games)\n", 
                        recentAvg, recentScores.size());
                }
                
                // Difficulty breakdown
                System.out.println("\n🎚️  Performance by Difficulty:");
                for (Difficulty d : Difficulty.values()) {
                    int played = difficultyPlayed.get(d);
                    int won = difficultyWins.get(d);
                    if (played > 0) {
                        double rate = (double) won / played * 100;
                        System.out.printf("   %s: %d/%d (%.1f%%)\n", 
                            d.getDescription(), won, played, rate);
                    }
                }
            }
        }
        
        public void displayFinalSummary() {
            if (totalGames > 0) {
                System.out.println("\n📈 SESSION SUMMARY:");
                System.out.println("Games this session: " + totalGames);
                if (gamesWon > 0) {
                    double avgGuesses = (double) totalGuesses / gamesWon;
                    System.out.printf("Average performance: %.1f guesses per win\n", avgGuesses);
                }
            }
        }
    }
    
    /**
     * Main method to start the application
     */
    public static void main(String[] args) {
        HiLoGame game = new HiLoGame();
        game.startGame();
    }
}
