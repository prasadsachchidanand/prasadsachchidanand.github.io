#import "template.typ": *
#let title = "Solution to Homework #1"
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

  + $h(s) = sqrt(s^2 - 3s)$

  + $p(x) = 4/(3 - x)$

  + $s(x) = sqrt(x^2 + 1)$
]

#soln[
  + The given function is $f(x) = 1 + x^2$. Since the function is defined for all $x in bb(R)$, the domain of the function is $bb(R)$. 

    Let us see what will be range of this function. For any $x in bb(R)$, 
    $
      0 <= x^2 < oo => 1 <= 1 + x^2 < oo.
    $
    Thus, the range of the fucntion will be $[1,oo)$. This range can be also be found as follows. Let $y in bb(R)$ and $y$ is in the range of $f$. Then there exists $x in bb(R)$ such that 
    $
      f(x) = y & => 1 + x^2 = y \
               & => x^2 = y - 1 \
               & => x = plus.minus sqrt(y-1).
    $
    The above expression is well defined if $y - 1 >=0$ which implies $y>=1$. Thus, the range will be $[1,oo)$.

  + The given function is $g(t) = 2/(t^2 - 16)$. This function will be well-defined if the denominator is nonzero. So, we must have 
    $ 
      t^2 - 16 != 0 =>(t-4)(t+4) != 0 => t != plus.minus 4. 
    $ 
    Thus, the domian of the given function will be 
    $
      text("Domain") = bb(R) - {plus.minus 4} = (-oo,-4) union (-4, 4) union (4,oo).
    $

    Now we will find the range of the function. If $y$ is in the range of $g$, then there exists $t in D(g)$ ($D(g)=$ domain of $g$) such that 
    $
      g(t) = y & => 2/(t^2 - 16) = y & => & 2 = t^2y - 16y \
               & => t^2y = 2 + 16y   & => & t^2 = (2 + 16y)/(y) \
               & => t = plus.minus sqrt((2 + 16y)/(y)).
    $
    The above expression is well defined if 
    $
      & (2 + 16y)/y >=0 quad text("and") quad y != 0 \
      => & cases(
        2 + 16y >= 0  text("if") y > 0, \

        2 + 16y <= 0 text("if") y < 0
      ) 
      quad text("and") quad y !=0 \

      => & cases(
        y >= -1/8 text("if") y > 0, \

        y <= -1/8 text("if") y < 0 
      )
      quad text("and") quad y !=0 \

      => & cases(
        y > 0,

        y <=-1/8.
      )
    $
    Thus, the range of the given function will be
    $
      R(g) = (-oo, -1/8] union (0, oo).
    $

  + Te given funciton is $sqrt(s^2 - 3s)$. For the domian of the function, we need 
    $
      s^2 - 3s >= 0 & => s(s - 3) >= 0.
    $
    This is a product of two numbers, namely $s$ and $s-3$. We break our anyalsis in three intervals shown below. 
    #figure(
      image("../img/HW-01-sol-prob-01-3.svg")
    )
    In the first and third intervals the sign of $s(s-3)$ is positve whereas in the second interval the sign is negative. Thus, the domian will be
    $
      D(h)=(-oo,0] union [3, oo).
    $

    To find the range, we first note that on the domain $s^2 - 3s >= 0$. Also, as $s$ approaches to infinity, $s^2 - 3s$ also approcahes to infinity. Thus, 
    $
      0 <= s^2 - 3s < oo => 0 <= sqrt(s^2 - 3s) < oo.
    $
    Thus, the range of the function will be $[0, oo)$. Note that we can also solve this problem similar to the earlier problems. 

  + The given function is $p(x) = 4/(3 - x)$. The function is defined everywhere except when $3 - x = 0$. So, the domain of the function is $bb(R) - {3}$. For the range, we observe that if $y in bb(R)$ such that
    $
      y = 4/(3 - x) & => 3y - x y = 4 => x = (3y - 4)/y,
    $
    which is defined except at $y = 0$. Thus, the range will be 
    $
      R(p) = bb(R) - {0}.
    $

  + The given function is $s(x) = sqrt(x^2 + 1)$. Since for any $x in bb(R)$, the value of $x^2 + 1 > 0$. Thus, the domain of the given function will be $bb(R)$. For the range, we observe that 
    $
      x^2 + 1 >= 1 & => sqrt(x^2 + 1) >= 1.
    $
    Thus, the range will be $[1,oo)$. This can also be solved similar to the earlier problems. Let $y in bb(R)$ be in the range. It is clear that $y >=1$. So, there exists $x in bb(R)$ such that 
    $
      s(x) = y & => sqrt(x^2 + 1) = y => x^2 + 1 = y^2 \
               & => x = plus.minus sqrt(y^2 - 1). 
    $
    The above expression is well defined if $y^2 - 1 >= 0$ which implies $(y - 1)(y + 1) >=0$. Similar to the third part of this problem, we will get $y in (-oo,-1] union [1, oo)$. Since $y >= 1$, the range will be 
    $
      R(s) = [1, oo).
    $
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

#soln[
  We will use vertical line test to check whether the given graph is a graph of some function of $x$. 

  #grid(
    columns: 2,
    gutter: 1cm,
    image("../img/HW-01-sol-graph-01.svg", width: 80%),
    image("../img/HW-01-sol-graph-02.svg", width: 80%),

    image("../img/HW-01-sol-graph-03.svg", width: 80%),
    image("../img/HW-01-sol-graph-04.svg", width: 80%),
  )
  It is clear that the first and third one can not be a graph of a function of $x$ as the shown vertical line intersects the graph more than once. The other two graphs are the graphs of some function of $x$.
]

#prob[
  Express the area and perimeter of an equilateral triangle as a function of the triangle's side length $x$.
]

#soln[
  Since the side length of the equilateral triangle is $x$, the perimeter function will be 
  $
    P: (0, oo) -> (0, oo), quad p(x) = 3x.
  $
  #figure(
    image("../img/HW-01-sol-prob-03.svg", width: 30%)
  )
  Similarly, the area function will be 
  $
    A : (0, oo) -> (0, oo), quad A(x) = (sqrt(3))/4 x^2.
  $
]

#prob[
  Consider the point $(x,y)$ lying on the graph of the line $2x + 4y = 5$. Let $ell$ be the distance from the point $(x,y)$ to the origin $(0,0)$. Write $ell$ as a function of $x$.
]

#soln[
  Take any point $(x,y)$ on the line $2x + 4y = 5$. So, we can write 
  $
    y = (5-2x)/4.
  $
  Thus, the point will be $(x,(5-2x)/4)$. The distance to this point to the origin will be 
  $
    l(x) & = sqrt((x-0)^2 + ((5-2x)/4 - 0)^2)  \
         & = sqrt(x^2 + ((5-2x)/4)^2) \
         & = sqrt(x^2 + (25 - 20x + 4x^2)/(16)) \
         & = sqrt((16x^2 + 25 - 20x + 4x^2)/(16)) \
         & = sqrt((20x^2 - 20x + 25))/4
  $
  Look at the figure below. 
  #figure(
    image("../img/HW-01-sol-prob-04.svg", width: 60%)
  )
]

#prob[
  Find the domain of each functions. 
  
  + $f(x) = (x + 3) / (4 - sqrt(x^2 - 9))$.

  + $g(t) = t/(abs(t))$.

  + $h(x) = sqrt(1-x^2)$.

  + $s(t) = sqrt(-t)$.
]

#soln[
  + The given function is 
    $
      f(x) = (x + 3)/(4 - sqrt(x^2 - 9)).
    $
      The above function is defined everywhere except when 
      $
          & 4 - sqrt(x^2 - 9) = 0 quad text("and") quad x^2 - 9 < 0 \
        => & x^2 - 9 = 16 quad text("and") quad (x - 3)(x + 3) < 0 \
        => & x^2 - 25 = 0 quad text("and") quad x in (-3, 3) \
        => & (x - 5)(x+5) = 0 quad text("and") quad x in (-3,3) \
        => & x = plus.minus 5 quad text("and") quad x in (-3,3).
      $
      Thus, the domian of the given function will be 
      $
        D(f) = bb(R) - [(-3,3) union {-5,5}].
      $

  + The given function is 
    $
      g(t) = t/abs(t).
    $
      This function is defined everywhere except when $abs(t) = 0$, that is, $t = 0$. Thus, the domain will be 
    $
      D(g) = bb(R) - {0}.
    $
  
  + The given function is 
    $
      h(x) = sqrt(1- x^2).
    $
    The above function will be defined if 
    $
      1 - x^2 >= 0 & => (1-x)(1 + x) >=0 => x in [-1,1].
    $
    Thus the domian will be 
    $
      D(h) = [-1, 1].
    $

  + The given function is 
  $
    s(t) sqrt(-t).
  $
  Again, this function will be defined if 
  $
    -t >= 0 => t <= 0 => t in (-oo, 0].
  $
  Thus, the domian will be 
  $
    D(s) = (-oo, 0].
  $
]

#prob[
  How many points are there in the range of a constant function $f: bb(R) -> bb(R)$?
]

#soln[
  Since, a constant function can only take one value, then range contains excatly one point. Thus, there is only one point in the range set. 
]

#prob[
  Write if the functions are *increasing*, *decreasing*, *strictly inccreasing* or *strictly decreasing*.

  #grid(
    columns: 2,
    gutter: 1cm,
    image("../img/HW-01-monotone-01.svg", width: 85%),
    image("../img/HW-01-monotone-02.svg", width: 85%),

    image("../img/HW-01-monotone-03.svg", width: 85%),
    image("../img/HW-01-monotone-04.svg", width: 85%),
  )
]

#soln[
  - The first function is increasing (*not* strictly increasing).

  - The second function is neither increasing nor decreasing. 

  - The third function is decreasing (*not* strictly decreasing). 

  - In the last problem, the function $f$ is strictly increasing whereas the function $g$ is strictly decreasing. 
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

#soln[
   #set list(marker: [‣])
   + $f(x) = sqrt(x)$. 

    - After first transformation: $F_1(x) = sqrt(x) + 4$.

    - After second transformation: $F_2(x) = sqrt(x - 10) + 4$.

  + $f(x) = sin x + tan x + e^(x^2)$. 

    - After first transformation: $F_1(x) = f(x +20)$.

    - After second transformation: $F_2(x) = f(x + 20) - 5$.

    - After third transformation: $F_3(x) = f(x + 20 - 20) - 5 = f(x) - 5$.

    - After fourth transformation: $F_4(x) = f(x) - 5 + 20 = f(x) +15$.
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

#soln[
  #set list(marker: [‣])
  + $f(x) = -x^2$

    - Position (a): $-(x +7)^2$.

    - Position (b): $-(x-3)^2$.

  + $f(x) = x^2$

    - Position (a): $x^2 + 3$.

    - Position (b) = $x^2 -1$.

]
