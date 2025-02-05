#import "template.typ": *
#let title = "Homework #3"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Engineering Mathematics-1"
#let instructor = "Sachchidanand Prasad"
#let semester = "Spring 2024"
#let prob_type = "Taylor and Maclaurin Series"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#theory[
  This set of problems is based on Taylor and Maclaurin series. Let us recall both the series once (for details see in the lecture notes). 

    #theoremBox(
      title: "Taylor's Series",
      color: "blue",
      radius: 5pt,
      width: auto
    )[
      #text(maroon)[
        If $f$ is an infinitely differentiable function (that is, we can differentiate infinitely many time) at some point $a$. Then the _Taylor series_ of $f$ at $x = a$ is 
        $
          f(x) & = f(a) + f'(a)(x - a) + frac(f''(a),2!)(x-a)^2 + dots + frac(f^((n))(a),n!)(x - a)^n + dots.
        $
      ]
    ]

    #theoremBox(
      title: "Maclaurin Series",
      color: "blue",
      radius: 5pt,
      width: auto
    )[
      #text(maroon)[
        The _Maclaurin series_ of $f$ is the Taylor series at $x = 0$. That is, 
        $
          f(x) = f(0) + f'(0)x + frac(f''(0),2!)x^2 + dots + frac(f^((n))(0),n!)x^n + dots.
        $
      ]
    ]
]

#prob[
  Find the first three Taylor polynomial of the function
  $
    f(x) = x^4 + x^2 + 1, quad a = -2.
  $
]

#prob[
  Find the Taylor polynomial of order $3$ of the given funcitons at $x = a$.

  + $f(x) = e^(2x)$, #h(1em) $a = 0$

  + $f(x) = sin x$, #h(1em) $a = 0$

  + $f(x) = sin x$, #h(1em) $a = pi/4$

  + $f(x) = tan x$, #h(1em) $a = pi/4$

  + $f(x) = sqrt(1 - x)$, #h(1em) $a = 0$
]

#prob[
  Find the Maclaurin series of the following functions. 

  + $f(x) = e^(-x)$

  + $f(x) = x e^x$

  + $f(x) = (2 + x)/( 1- x)$

  + $f(x) = sin (x/2)$

  + $f(x) = x cos x$
]

#theory[
  The next set of problems is based on the maximum error in a Taylor's polynomial.


  #theoremBox(
      title: "Lagrange's Form of the Remainder",
      color: "blue",
      radius: 5pt,
      width: auto
    )[
      #text(maroon)[
        The remainder
        $
          f(x) = sum_(k=0)^n frac(f^((k))(c), (k+1)!)(x-a)^(n+1),
        $
        for some $c$ between $a$ and $x$ is called _Lagrange's form of the remainder_.
      ]
    ]

  #theoremBox(
      title: "Taylor's Inequality",
      color: "blue",
      radius: 5pt,
      width: auto
    )[
      #text(maroon)[
        If $abs(f^((n+1))(x)) <= M$ for all $x$ such that $abs(x - a) <= d$, then 
        $
          abs(R_n (x)) <= frac(M, (n+1)!)abs(x - a)^(n+1)
        $
        for all $x$ in the interval $abs(x-a)<= d$
      ]
    ]

    Let us discuss an example, that we discussed in the class. 
    
    #text(red)[
      *Problem:* Obtain the fourth-degree Taylor's polynomial approximaiton to $f(x) = e^(2x)$ about $x = 0$. Find the maximum error when $0 <= x <= 0.5$.
    ]

    #text(blue)[
      *Solution:* Let us first find the fourth degree Taylor's polynomial. 
      $
        p_4(x) = f(0) + f'(0)x + frac(f''(0),2!)x^2 + frac(f^((3))(0),3!)x^3 + frac(f^((4))(0), 4!)x^4. 
      $
      We have 
      $
        f(x) = e^(2x)   & => f(0) = 1 \
        f'(x) = 2e^(2x) & => f'(0) = 2 \
        f''(x) = 4e^(2x) & => f''(0) = 4 \
        f^((3))(x) = 8e^(2x) & => f^((3))(0) = 8 \
        f^((4))(x) = 16e^(2x) & => f^((4))(0) = 16.
      $
      Thus, the required Taylor's polynomial will be 
      $
        p(x) & = 1 + 2x + 4/2 x^2 + 8/(3!)x^3 + 16/4!x^4 \
              & = 1 + 2x + 2x^2 + 4/3 x^3 + 2/3 x^4
      $

      We now find the maximum error. According to Taylor's theorem, there exists $c$ between $a = 0$ and $x$ such that 
      $
        R_4(x) = frac(f^((5))(c), 5!) x^5.
      $
      Note that $e^(2x)$ is an increaing funciton, So, 
      $
        f^((5))(x) = 32 e^(2x) => max_(c in (0,x) "and" x in (0,0.5))32e^(2c) = 32e^(2 times 0.5) = 32e.
      $
      So, using the Taylor's theorem, 
      $
        abs(R_4(x)) <= 32e max_(x in (0,0.5)) x^5/5! = 32e frac(0.5^5,5!) = 0.00026e = 0.0007.
      $
  ]
]

#prob[
    Calculate the second order Taylor polynomial for $f(x) = sqrt(1 + x)$ about $x = 0$, and write down a formula for the Remainder term $R_2(x)$. Hence show that 
    $
      1 + 1/2 x^4 - 1/8 x^8 <= sqrt(1 - x^4) <= 1 + 1/2x^4 - 1/8 x^8 + 1/(16) x^(12) quad "for all " x in bb(R).
    $
]

#prob[
  Find the Maclaurin's series expansion of $f(x) = tan^(-1)x$ up to four terms with Lagrange's form of the remainder. 
]

#prob[
  Find the Taylor's series expansion of $sin^2x$ up to five terms with Lagrange's form of remainder.
]

#prob[
  Use Taylor's theorem to approximate value of $a = sqrt(1.5)$ and $b = cos 31^degree$.
]

#prob[
  Use Taylor's theorem to prove that
  $
    x - x^2/2 < log(1 + x) < x quad quad "for" x > 0.
  $
]

#prob[
  Let $f(x) = ln(1 + x)$. (Here #text(blue)[$ln x = log_e x$])

  + Calculate the fourth order Taylor polynomial $T_4(x)$ for $f(x)$ centered at $x = 0$. 

  + Use Taylor's Theorem to write down a formula for the fourth remainder term $R_4(x)$, and deduce that
    $
      frac(x^5, 5(1 + x)^5) <= f(x) - T_4(x) <=frac(x^5,5) quad "for all " x >= 0.
    $
]

#prob[
  Express the polynomial 
  $
    p(x) = x^4 + 3x^2 - 2x + 1
  $
  in powers of $(x - 2)$.
]