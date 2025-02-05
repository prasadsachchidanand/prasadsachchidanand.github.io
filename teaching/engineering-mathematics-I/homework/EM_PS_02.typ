#import "template.typ": *
#let title = "Homework #2"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Engineering Mathematics-1"
#let instructor = "Sachchidanand Prasad"
#let semester = "Spring 2024"
#let prob_type = "application of derivative"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#instruction[
  This set of problems is based on Rolle's theorem and Lagrange's mean value theorem. Let us recall both the theorems (for details see in the lecture notes). 

    #theoremBox(
      title: "Rolle's Theorem",
      color: "blue",
      radius: 5pt,
      width: auto
    )[
      #text(maroon)[
        Let $f$ be defined on $[a,b]$ such that 

        - $f$ is continuous on $[a,b]$,

        - $f$ is differentiable on $(a,b)$ and 

        - $f(a) = f(b)$.

        Then, there exists $c in (a,b)$ such that 
        $
          f'(c) = 0.
        $
      ]
    ]

    #theoremBox(
      title: "Lagrange's Mean Value Theorem",
      color: "blue",
      radius: 5pt,
      width: auto
    )[
      #text(maroon)[
        Let $f$ be defined on $[a,b]$ such that 

        - $f$ is continuous on $[a,b]$,

        - $f$ is differentiable on $(a,b)$ and 

        Then, there exists $c in (a,b)$ such that 
        $
          (f(b) - f(a))/(b - a) = f'(c).
        $
      ]
    ]
]

#prob[
  Verify Rolle's theorem for the function $x^2$ in $(-1,1)$.
]

#prob[
  Verify Rolle's theorem for $f(x) = log ((x^2 - 6)/x)$ in the interval $[-2,3]$.
]

#prob[
  For the following function find $c$ using mean value theorem. 
  $
    f(x) = (x-1)(x-2)(x-3), quad "in the interval" [0,4].
  $
]

#prob[
  Show that if $f'(x) = 0$ at each point in the interval $(a,b)$, then $f(x)$ is constant over $(a,b)$. 
]

#prob[
  Determine all the numbers $c$ which satisfy the conclusions of the Mean Value Theorem for the following function. 
  $
    f(x) = x^3 + 2x^2 - x quad "on" quad [-1,2].
  $
]
#prob[
   Determine if the Mean Value Theorem can be applied to the following function on the the given closed interval. If so, find all possible values of $c$.
   $
    f(x) = x + 3 cos x quad "on" quad [-pi, pi].
   $
]

#prob[
  Check the validity of Lagrange's mean value theorem for the function 
  $
    f(x) = x^2 -3x + 5
  $
	on the interval $[1,4]$. If the theorem holds, find a point $c$ satisfying the conditions of the theorem.
]