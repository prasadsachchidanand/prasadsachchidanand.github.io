#import "template.typ": *
#let title = "Homework #4"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "group and field"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)


#prob[
  In a field $bb(F)$, prove that $a dot b = 0$, then either $a = 0$ or $b = 0$.  
]

#prob[
  Let 
  $
    G L(bb(R)^n) = {T: bb(R)^n -> bb(R)^n : T " is linear and invertible"}. 
  $
  Show that $G L(bb(R)^n)$ is a group under composition of functions. Can you think of a relation between $G L(bb(R^n))$ and $G L_n (bb(R))$?
]

#prob[
  We have seen in the lectures that $R_theta = mat(cos theta, -sin theta; sin theta, cos theta)$ is a rotation matrix (rotation in the counterclockwise direction by an angle $theta$). 
  
  Now, let $T_theta$ denote the reflection about the line $L_theta$ through the origin that makes an angle $theta$ with the $x$-axis. Write the matrix of $T_theta$. Check whether the set ${T_theta: theta in bb(R)}$ of all such reflections forms a group under matrix multiplication.

  #figure(
    image("../img/reflection.svg", width: 50%),
    caption: [
      Reflection about the line $L_theta$ 
    ],
  )
]

#prob[
  Show that the set of all rotations and reflections (described in the previous problem) is a group under matrix multiplication. Can you identify this group?
]