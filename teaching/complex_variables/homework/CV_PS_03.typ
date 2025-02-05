#import "template.typ": *
#let title = "Homework #3"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Complex Variables"
#let instructor = "Sachchidanand Prasad"
#let semester = "Spring 2024"
#let prob_type = "complex functions"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
  In the following problems represnt $f(z) = u(x,y) + iota v(x,y)$. Let me show an example. If $f(z) = z^2$, then put $z = x + iota y$. We have
  $
    f(z) = z^2 & = (x + iota y)^2 \
               & = x^2 + (iota y)^2 + 2x(iota y) \
               & = x^2 - y^2 + iota(2x y). 
  $
  Thus, 
  $
    u(x,y) = x^2 - y^2 quad text("and") quad v(x,y) = 2x y. 
  $

  + $f(z) = z^3$

  + $f(z) = 5z^2 - 12z + 3 + 2iota$

  + $f(z) = (z - 2)/(z + 2)$

  + $f(z) = "Re"(z^2)/abs(z)$, where $"Re"(z^2)$ represents the real part of $z^2$.

  + $f(z) = abs(z)^2$

  + $f(z) = z overline(z)^2 + overline(z)$

  + $f(z) = z overline(z)$

  + $f(z) = abs(z) ^2 + overline(z)^2 + z^2$

  + $f(z) = z^3 + iota overline(z) + 1 + iota$

  + $f(z) = z^4 - (1 + iota) overline(z)^2 - (1- iota) abs(z)^2$
]

#prob[
  If $f(z) = u(x,y) + iota v(x,y)$, then the real part of $f$ is $u(x,y)$ and the imaginary part of $f$ is $v(x,y)$. In the following problems find $"Re"(f)$, and $"Im"(f)$ and their values at the given point $z$.

  + $f(z) = 5z^2 - 12z  + 3 + 2iota$ at $z = 4 - 3iota$

  + $f(z) = 1/(1 - z)$ at $z = 1 - iota$

  + $f(z) = (z-2)/(z +2)$ at $z = 8iota$

  + $f(z) = (z - iota)/ (z + iota)$ at $z = 1$

  + $f(z) = (6 - 5iota)z + 1 - 3i$ at $z = 1+ iota$
]

