import type { subject_item } from '../types';

export const hi_mathematics: subject_item = {
    "id": "hs-math",
    "title": "Calculus & Advanced Math",
    "level": "highschool",
    "category": "Core",
    "topics": [
        "Pre-Calculus Foundations",
        "Limits & Continuity",
        "Derivatives",
        "Applications of Derivatives",
        "Integrals",
        "Advanced Geometry",
        "Probability Theory",
        "Linear Algebra"
    ],
    "notes": {
        "Pre-Calculus Foundations": "The essential algebraic and trigonometric concepts required for Calculus.\n\n• Functions: Domain and range.\n• Trigonometric Identities: Pythagorean identity (sin²θ + cos²θ = 1).\n• Logarithms & Exponentials.",
        "Limits & Continuity": "The core conceptual bridge moving from static algebra to dynamic calculus.\n\n• The Limit: lim(x→a) f(x) = L.\n• Continuity: No holes, jumps, or vertical asymptotes.",
        "Derivatives": "Derivatives measure the instantaneous rate of change or the slope of the tangent line to a curve at any given point.\n\n• Power Rule: For f(x) = x^n, f'(x) = n*x^(n-1).\n• Chain Rule: f'(g(x)) * g'(x).",
        "Applications of Derivatives": "Using slopes to solve real-world optimization problems.\n\n• Extrema: Finding relative maximums and minimums (f'(x) = 0).\n• Concavity: The second derivative f''(x).",
        "Integrals": "Integration is the mathematical process of finding the total accumulation of a quantity, such as area under a curve.\n\n• Fundamental Theorem of Calculus: ∫(from a to b) f'(x)dx = f(b) - f(a).",
        "Advanced Geometry": "Moving past basic 2D shapes into rigorous mathematical proofs.\n\n• Axioms and Theorems: Utilizing Euclid's axioms to formally prove geometric relationships.\n• Conic Sections: Circle, Ellipse, Parabola, and Hyperbola equations. Slicing a theoretical 3D cone at different angles.",
        "Probability Theory": "The mathematics governing chance, risk, and uncertainty.\n\n• Independent vs Dependent Events: Does drawing a card fundamentally alter the outcome of the next draw?\n• Combinatorics: Permutations (order matters) vs Combinations (order does not matter).\n• Conditional Probability: Bayes' Theorem solving P(A|B) - the likelihood of A given that B has already occurred.",
        "Linear Algebra": "The mathematics of vectors and matrices.\n\n• Matrices: Arrays of numbers that can represent massive systems of linear equations.\n• Vectors: Quantities possessing both magnitude and direction essential in physics and 3D rendering.\n• Transformations: Using matrix multiplication to rotate or scale space."
    }
};
