#import "template.typ": *
#let title = "Homework #1"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "GATE 2025"
#let instructor = "Sachchidanand Prasad"
#let semester = "Spring 2024"
#let prob_type = "Functions"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
  Find the domain and range of each functions. 

  + $f(x) = 1 + x^2$

  + $g(t) = 2/(t^2 - 16)$

  + $h(s) = sqrt(x^2 - 3x)$

  + $p(x) = 4/(3 - x)$

  + $s(x) = sqrt(x^2 + 1)$
]

#prob[
  Which of the following are graphs of functions of $x$?

  #grid(
    columns: 2,
    gutter: 1cm,
    image("../img/HW-01-graph-01.svg", width: 80%),
    image("../img/HW-01-graph-02.svg", width: 80%),

    image("../img/HW-01-graph-03.svg", width: 80%),
    image("../img/HW-01-graph-04.svg", width: 80%),
  )
]

#prob[
  Express the area and perimeter of an equilateral triangle as a function of the triangle's side length $x$.
]

#prob[
  Consider the point $(x,y)$ lying on the graph of the line $2x + 4y = 5$. Let $ell$ be the distance from the point $(x,y)$ to the origin $(0,0)$. Write $ell$ as a function of $x$.
]

#prob[
  Find the domain of each functions. 
  
  + $f(x) = (x + 3) / (4 - sqrt(x^2 - 9))$.

  + $g(t) = t/(abs(t))$.

  + $h(x) = sqrt(1-x^2)$.

  + $s(t) = sqrt(-t)$.
]

#prob[
  How many points are there in the range of a constant function $f: bb(R) -> bb(R)$?
]

#prob[
  Write if the functions are *increasing*, *decreasing*, *strictly inccreasing* or *strictly decreasing*.

  #grid(
    columns: 2,
    gutter: 1cm,
    image("../img/HW-01-monotone-01.svg", width: 80%),
    image("../img/HW-01-monotone-02.svg", width: 80%),

    image("../img/HW-01-monotone-03.svg", width: 80%),
    image("../img/HW-01-monotone-04.svg", width: 80%),
  )
]

#prob[
  Write the function after the given transformations. 

  #set list(marker: [‣])
  + $f(x) = sqrt(x)$. 

    - Upward $4$ units.
    
    - Right side $10$ units.
  
  + $f(x) = sin x + tan x + e^(x^2)$. 

    - Towards left $20$ units.
    
    - Downward $5$ units.

    - Towards right $20$ units.

    - Upward $10$ units.
]

#prob[
  The accompanying figure shows the graph of $y = -x^2$ shifted to two new positions. Write equations for the new graphs.
  
  + #figure(
    image("../img/HW-01-transformation-01.svg", width: 100%)
  )
  
  + #figure(
    image("../img/HW-01-transformation-02.svg", width: 50%)
  )
]
