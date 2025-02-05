#import "template.typ": *
#let title = "Homework #4"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Complex Variables"
#let instructor = "Sachchidanand Prasad"
#let semester = "Spring 2024"
#let prob_type = "analytic functions"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#tips[
    We recall that if a function $f(z) = u(x,y) + iota v(x,y)$ is analytic at $z_0 = x_0 + iota y_0$, then it must satisfy the Cauchy-Riemann equaitons at $z_0$. 
    $
      u_x = v_y quad "and" quad u_y = -v_x.
    $
    We can also write the Cauchy-Riemann equations in the polar form. For example, consider the function 
    $
      f(z) = z^2 + 3z.
    $
    #text(purple)[
      If we replace $z = x + iota y$, we get 
      $
        f(z) = (x^2 - y^2 + 3x) + iota(2x y +3y).
      $
      Thus, 
      $
        u(x,y) = x^2 - y^2 + 3x quad "and" quad v(x,y) = 2 x y + 3y.
      $
    ]
    
    #text(blue)[
      Similarly, if we take $z = r (cos theta + iota sin theta)$, then can write the function we can write $f(z) = u(r, theta) + iota v(r, theta)$. 
      $
        f(z) = z^2 + 3z & = (r (cos theta + iota sin theta))^2 + 3 (r (cos theta + iota sin theta)) \
        & = r(cos^2 theta - sin^2 theta + 2iota cos theta sin theta) + 3r cos theta + iota 3r sin theta \
        & = r(cos 2 theta + iota sin 2theta) + 3r cos theta + iota 3r sin theta \
        & = r(cos 2 theta + 3r cos theta) + iota (r (sin 2 theta + 3 sin theta)).
      $
      Thus, 
      $
        u(r,theta) = r(cos 2 theta + 3r cos theta) quad "and" quad v(r,theta) = r (sin 2 theta + 3 sin theta).
      $
    ]

    The Cauchy-Riemann equations in the polar form is given by 
    $
      u_r = 1/r v_theta quad "and" quad v_r = - 1/r u_theta.
    $
]

#theory[
  We recall some of the important complex functions. 

  + Exponential funciton
    $
      e^z = e^(x + iota theta) = e^x (cos theta + iota sin theta)
    $
    #line(length: 100%, stroke: 0.5pt+ gray)

  + Trigonometric functions
    $
      cos z & = (e^(iota z) + e^(-iota z))/2 , quad sin z = (e^(iota z) - e^(-iota z))/(2 iota)
    $
]

#prob[
  Check whether the following functions satisfy the Cauchy-Riemann equations. 

  + $f(z) = iota z overline(z)$

  + $f(z) = e^(-2x) (cos 2y - iota sin 2y)$

  + $f(z) = e^x (cos y - iota sin y)$

  + $f(z) = "Re"(z^2) - iota "Im"(z^2)$

  + $f(z) = 1/(z - z^5)$

  + $f(z) = iota/z^8$

  + $f(z) = (3 pi^2)/(z^3 + 4 pi^2 z)$.

  #text(orange)[
    To make easier, use the polar form of the Cauchy-Riemann equations in the last three problems. 
  ]
]

#prob[
  Find the value of $c_1$ and $c_2$ such that the function 
  $
    f(z) = x^2 + c_1 y^2 - 2x y + iota (c_2 x^2 - y^2 + 2x y)
  $
  is analytic. 
]

#prob[
  Find $k$ such that the function $f(z)$ expressed in polar coordinates as 
  $
    f(z) = r^2 cos 2theta + iota r^2 k theta
  $
  is analytic. 
]
