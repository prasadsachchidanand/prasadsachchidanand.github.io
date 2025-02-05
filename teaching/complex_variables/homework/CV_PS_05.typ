#import "template.typ": *
#import "@preview/ctheorems:1.1.2": *
#import "@preview/colorful-boxes:1.2.0": *
#let title = "Homework #5"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Complex Variables"
#let instructor = "Sachchidanand Prasad"
#let semester = "Spring 2024"
#let prob_type = "harmonic functions"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#tips[
  = Harmonic Functions

    #v(10pt)
    We recall that a real valued function $f(x,y)$ is said to be _harmonic_ in a domain $D$ if 
    $
      (partial^2f)/(partial^2x) + (partial^2f)/(partial^2y) = 0 quad ("also written as" f_(x x) + f_(y y) = 0)
    $
    in $D$.

    #text(purple)[
      For example, 
      $
        f(x,y) = x^2 - y^2 & => f_x = 2x quad "and" quad f_y = -2y \
                           & => f_(x x) = 2 quad "and" quad f_(y y)= -2.
      $
      Thus, 
      $
        f_(x x) + f_(y y) = 2 - 2 = 0.
      $
      Thus, $f(x,y)$ is harmonic function. 
    ]

    #colorbox(
      title: "Theorem",
        color: "blue",
        radius: 3pt,
        width: auto
    )[
      Suppose that the complex function $f(z) = u(x,y) = iota v(x,y)$ is analytic in a domain $D$. Then the funcitons $u(x,y)$ and $v(x,y)$ are harmonic in $D$.
    ]
    
    #text(purple)[
      For example, $f(z) = z^2$, then 
      $
        f(z) = z^2 = (x^2 - y^2) + iota (2x y).
      $
      Thus, 
      $
        u(x,y) = x^2 - y^2 quad "and" quad v(x,y) = 2x y.
      $
      Then it is clear that 
      $
        u_(x x) + u_(y y) = 0 quad "nd" quad v_(x x) + v_(y y) = 0.
      $
      Thus, real and imaginary part of the analytic function is harmonic.
    ]

    = Harmonic Conjugate Funcitons
    #v(10pt)
    #colorbox(
      title: "Theorem",
        color: "blue",
        radius: 3pt,
        width: auto
    )[
      If $u(x,y)$ is a function which is harmonic in a domian $D$, then there exists a harmonic function $v(x,y)$ in $D$ such that the function $f(z) = u(x,y) + iota v(x,y)$ is analytic on $D$. 
    ]
    
    In the above, the function $v(x,y)$ is said to be _harmonic conjugate_ of $u(x,y)$. 
]

#theory[
  Let us discuss how to find an harmonic conjugate. 

  #text(blue)[
    In the above we proved that the function $u(x,y) = x^2 - y^2$ is harmonic. Let us find its harmonic conjugate. That is, we need to find a harmonic function $v(x,y)$ such that $f(z) = u(x,y) + iota v(x,y)$ is analytic. If $f(z) = u(x,y) = iota v(x,y)$ is analytic, it must satisfies the Cauchy-Riemann equaitons. That is, 
    $
      u_x = v_y quad "and" quad u_y = -v_x.
    $
    Consider the first equation, we get 
    $
      u_x = v_y & => 2x = v_y \
                & => integral (partial v)/(partial y) "d" y = integral 2x "d" y \
                & => v(x,y) = 2x y + c(x),
    $
    where $c(x)$ is a function of $x$ only. #text(purple)[Note that when we do integration we get the constant of the integration. Since, $v$ is a function of $x$ and $y$ both, when we do integration with $"d"y$, the constant maybe a function of $x$ also.] We now will use the second equaiton. 
    $
      u_y = -v_x & => -2y = -(2y + c'(x)) \
                 & => -2y = -2y - c'(x) \
                 & => c'(x) = 0 \
                 & => c(x) = k, quad "where" k " is a constant".
    $
    Thus, the harmonic conjugate of $u$ will be 
    $
      v(x,y) = 2x y + k, quad "where " k " is a constant".
    $
    The corresponding analytic function will be 
    $
      f(z) = u(x,y) + iota v(x,y) = x^2 - y^2 = iota (2x y + k).
    $
  ]
]

#prob[
  In the following problem verify that the given function is harmonic. If your answer is yes, then find the harmonic conjugate of $u$. Form the corresponding analytic function $f(z) = u + iota v$.

  + $u(x,y) = x$

  + $u(x,y) = 2x - 2x y$

  + $u(x,y) = x^2 - y^2$

  + $u(x,y) = x^3 - 3 x y^2$

  + $u(x,y) = log_e(x^2 + y^2)$

  + $u(x,y) = cos x cosh y$ #h(1cm) #text(red)[(The derivative of $cosh x$ is $sinh x$)]

  + $u(x,y) = e^x (x cos y - y sin y)$

  + $u(x,y) = -e^(-x) sin y$
]

#prob[
  Find an analytic function $f(z)$ such that 
  $
    "Re"(f'(z)) = 3x^2 - 4y - 3y^2 quad "and" quad f(1 + iota) = 0.
  $
]

