#import "template.typ": *
#let title = "Homework #1"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "review of linear algebra"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#theory[
  Let $V,W$ be vector spaces over $bb(R)$. A map $T: V -> W$ is called a _linear map_ if for $alpha_1, alpha_2 in bb(R)$ and $bold(v)_1, bold(v)_2 in V$, 
  $
    T(alpha_1 bold(v)_1 + alpha_2 bold(v)_2) = alpha_1 T(bold(v)_1) + alpha_2 T(bold(v)_2).
  $
]

#conventions[
  + In all the problem below, unless specified, $V,W$ denotes the vector spaces over $bb(R)$. 

  + Linear map and linear transformation will be used interchangeably. 
]

#prob[
  Let $T$ be a linear transformation from $V$ to $W$. Show that $T(bold(0)) = 0$.
]

#prob[
  Describe geometrically the action of $T$ on the square whose vertices are at $(0,0), (1,0), (1,1)$ and $(0,1)$.

  + $T mat(x;y) = mat(-x;y)$

  + $T mat(x;y) = mat(y;x)$ 

  + $T mat(x;y) = mat(2x; y)$

  + $T mat(x;y) = mat(x+y; y)$
]

#prob[
  Let $T: bb(R)^3 -> bb(R)^4$ be the linear transformation defined by 
  $
    T mat(x;y;z) = mat(x + y; 3x - z; 2y - 3z; 4x + 2y + z).
  $
  Find the matrix of $T$ with respect to the standard bases. Also find the matrix of $T$ with respect to the bases 
  $
    {e_1 + e_2, e_1 - e_2, e_3} "and" {e_1, e_2, e_3, e_4}.
  $
]

// #prob[
//   Consider all rotations of the plane $bb(R)^2$ about the origin. Work through the following steps to describe each rotation by an explicit linear map and then identify the full set.
  
//   1. *Rotation formula*
     
//      Write the rotation by angle $theta$ as a linear transformation:
//      $ R_theta = mat(cos(theta), -sin(theta); sin(theta), cos(theta)) $
     
//      acting on column vectors $vec(x, y)$.
     
//      Show that $R_theta$ is linear and sends the unit circle to itself.
  
//   2. *Basic properties*
     
//      a) Prove that $det(R_theta) = 1$, so $R_theta in "GL"_2(bb(R))$.
     
//      b) Show $R_theta^T R_theta = I$, so $R_theta in "SO"(2)$.
  
//   3. *Composition and inverses*
     
//      Compute $R_theta R_phi$ and prove:
//      $ R_theta R_phi = R_(theta + phi). $
     
//      Identify the identity $R_0$ and inverse $R_theta^(-1)$.
  
//   4. *Identify the set of all rotations*
     
//      Let $cal(R) = {R_theta : theta in bb(R)}$.
     
//      a) Show $cal(R)$ is closed under composition and inverses, hence a subgroup of $"GL"_2(bb(R))$.
     
//      b) Show $cal(R) subset.eq "SO"(2)$.
     
//      c) Prove that any $A in "SO"(2)$ equals $R_theta$ for some $theta$. Conclude $cal(R) = "SO"(2)$.
  
//   5. *Group isomorphisms*
     
//      Show:
//      $ cal(R) tilde.equiv S^1 tilde.equiv bb(R) slash 2pi bb(Z) $
     
//      via the maps $R_theta |-> e^(i theta)$ and $theta |-> [theta]$.
// ]