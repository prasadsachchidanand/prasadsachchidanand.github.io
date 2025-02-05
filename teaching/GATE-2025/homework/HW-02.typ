#import "template.typ": *
#let title = "Homework #2"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "GATE 2025"
#let instructor = "Sachchidanand Prasad"
#let semester = "Spring 2024"
#let prob_type = "Limits"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
  Identify if the given function is even or odd. 
  #grid(
    columns: 2,
    gutter: 1cm,
    image("../img/HW-02-evenOdd-01.svg", width: 80%),
    image("../img/HW-02-evenOdd-02.svg", width: 80%),

    image("../img/HW-02-evenOdd-03.svg", width: 70%),
    image("../img/HW-02-evenOdd-04.svg", width: 70%),
  )
]

#prob[
  Look at the figure below. The graph of the function $y= f(x)$ is given. Identify the other graphs. 
  #figure(
    image("../img/HW-02-graphIdentification-01.svg", width: 60%)
  )

]

#prob[
  Find an equation of the tangent line to the parabola $y = x^2$ at the point $P(1,1)$.
  #figure(
    image("../img/HW-02-tangentLine-01.svg", width: 65%)
  )
]

#prob[
  In the following problems find the average rate of change of the function over the given intervals. 

  + $f(x) = x^3 + 1$

    a. $[2,3]$ #h(30%) b. $[-1,1]$

  + $g(x) = x^2 - 2x$

    a. $[1,3]$ #h(30%) b. $[-2,4]$
    
  + $h(t) = 2 + cos t$

    a. $[0, pi]$ #h(30%) b. $[-pi, pi]$

]

#prob[
  In the figures below, find the limit as $x$ approacher to $a$, that is, $display(lim_(x -> a)f(x))$.
  #grid(
    columns: 3,
    gutter: 1cm,
    image("../img/HW-02-limitIdentification-01.svg", width: 100%),
    image("../img/HW-02-limitIdentification-02.svg", width: 100%),
    image("../img/HW-02-limitIdentification-03.svg", width: 100%),
  )
]

#prob[
  In the figures below, find the following limits.
  #figure(
    image("../img/HW-02-limitFind-01.svg", width: 60%)
  )

  #v(0.5cm)

  (i) $display(lim_(x -> 2^-) f(x))$ #h(20%) (ii) $display(lim_(x -> 2^+) f(x))$ #h(20%) (iii) $display(lim_(x -> 2) f(x))$

  #v(0.2cm)
  (iv) $display(lim_(x -> 4^-) f(x))$ #h(20%) (v) $display(lim_(x -> 4^+) f(x))$ #h(20%) (vi) $display(lim_(x -> 4) f(x))$

  #v(0.2cm)
  (vii) $display(lim_(x -> 5^-) f(x))$ #h(20%) (viii) $display(lim_(x -> 5^+) f(x))$ #h(20%) (ix) $display(lim_(x -> 5) f(x))$
  
  #v(0.3cm)
]

#prob[
  Consider the following graphs.
  #grid(
    columns: 2,
    gutter: 1cm,
    image("../img/HW-02-limitfindInfinity-01.svg", width: 100%),
    image("../img/HW-02-limitfindInfinity-02.svg", width: 100%),
    image("../img/HW-02-limitfindInfinity-03.svg", width: 100%),
    image("../img/HW-02-limitfindInfinity-04.svg", width: 100%),
  )
  On each of the above graphs, find the following limits (if exist). 
  $
    lim_(x -> a^+)f(x), quad lim_(x ->a^-)f(x) quad text("and") quad lim_(x ->a)f(x)
  $
]

#prob[
  Consider the following graph of some function $y = f(x)$. 
  #figure(
    image("../img/HW-02-limitAtDifferentPoints.svg", width: 90%)
  )
  Find the following limits.
  
  (i) $display(lim_(x->-4) f(x))$ #h(20%) (ii) $display(lim_(x->-3)) f(x)$ #h(20%) (iii) $display(lim_(x ->-2)f(x))$
  #v(0.3cm)
  (iv) $display(lim_(x->3) f(x))$ #h(20%) (iv) $display(lim_(x->9)) f(x)$ #h(20%) (vi) $display(lim_(x ->-oo)f(x))$
  #v(0.2cm)
]

#prob[
  Sketch the graph of the function and use it to determine the values of $a$ for which $display(lim_(x -> a) f(x))$ exists.
  $
    f(x) = cases(
      1 + x text("if,") quad x < -1,\
      x^2 text("if,") quad -1 <= x <= 1, \
      2 - x text("if,") quad x >= 1.
    )
  $
]

#prob[
  Compute the following limits. 

  #set enum(numbering: "(i)")
  + $display(lim_(t -> 0) (sqrt(t^2 + 9) - 3)/(t^2))$.
    #v(0.3cm)
  + $display(lim_(x -> 0) (abs(x))/x)$.
    #v(0.3cm)
  + $display(lim_(x->0) x^2 sin(1/x))$.
    #v(0.3cm)
  + $display(lim_(x->0) (t^2 - 9)/(2t^2 + 7t + 3))$.
    #v(0.3cm)
  + $display(lim_(t -> 0)(1/t - 1/(t^2 + t)))$.
    #v(0.3cm)
  + $display(lim_(t -> 0)(sqrt(1+t) - sqrt(1 - t))/(t))$.
    #v(0.3cm)
  + $display(lim_(x -> 0) (x tan 2x - 2x tan x)/((1 - cos 2x)^2))$.
    #v(0.3cm)
  + $display(lim_(x->0) (tan x - sin x)/(x^3))$.
    #v(0.3cm)
  + $display(lim_(x -> 0) f(x))$, where 
    $f(x) = cases(
        (sin x)/x + cos x text(",") &quad  x != 0, 

        2 text(",") & quad x = 0 .
      )$
    #v(0.3cm)
  + $display(lim_(x -> 0) (x cos x - log(1 + x))/(x^2))$.
    #v(0.3cm)
  + $display(lim_(x -> 0)(1/x^2 - 1/(sin^2 x)))$.
    #v(0.3cm)
  + $display(lim_(x -> 0) x cot x)$. 
]

#prob[
  Find the $display(lim_(x -> 1) g(x))$, where 
  $
    g(x) = cases(
      x + 1 quad text("if") x != 1, 

      pi quad text("if") x = 1.
    )
  $
]

#prob[
  Find 
  $
    lim_(x -> 0) (x (e^x - 1) + 2(cos x - 1))/(x ( 1 - cos x)).
  $
]

#prob[
  If 
  $
    alpha = lim_(x ->0) x sin(1/x),
  $
  then find the value of $2024^alpha$.
]

#prob[
  Compute 
  $
    lim_(x->oo) (1/(sin x) - 1/ (tan x)).
  $
]

#prob[
  If 
  $
    k = lim_(theta ->0) (sin theta)/theta,
  $
  then what is the value of $k^(2024)$.
]

#prob[
  Find the limiting value of the ratio of the sum of square of $n$ natural numbers to $n$ natural numbers
]

#prob[
  Determine if the following limit exists. If yes, the find the value of the limit. 
  $
    lim_(x -> oo) (x^3 - cos x)/(x^2 + sin^2x)
  $
]

#prob[
  Find the values of $a$ and $b$ such that 
  $
    lim_(x -> 0) (x(1 + a cos x)- b sin x)/(x^3) = 2.
  $
]