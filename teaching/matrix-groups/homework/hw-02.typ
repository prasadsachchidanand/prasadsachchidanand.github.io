#import "template.typ": *
#let title = "Homework #2"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "linear transformations"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#conventions[
  + In all the problem below, unless specified, $V,W$ denotes the vector spaces over $bb(R)$. 

  + Linear map and linear transformation will be used interchangeably. 
]


#theory[
  Let ${v_1, v_2, dots, v_m}$ and ${w_1, w_2, dots, w_n}$ be bases of $V$ and $W$ respectively. Let $T: V -> W$ be a linear map.  Since $T(v_i) in W$ for each $i$, we can write
  $
    T(v_i) = sum_(j=1)^n a_(i j) w_j, quad 1 <= i <= m.
  $
  Then the matrix of $T$ with respect to the above choice of bases is 
  $
    [T]_W^V = 
    mat(
      a_(11) , a_(21) , dots , a_(m 1) ;
      a_(12) , a_(22) , dots , a_(m 2) ;
      dots.v, dots.v, dots.down, dots.v; 
      a_(1 i), a_(2 i), dots, a_(m i) ;
      dots.v, dots.v, dots.down, dots.v; 
      a_(1 n), a_(2 n), dots, a_(m n)
    )_(m times n).
  $
]

#prob[
  #text(orange)[*This problem we have already discussed in today's lecture. Try to go through the steps and think it through* The portions which involve group theory, and if you are not comfortable, you can skip that].
  
  Consider all rotations of the plane $bb(R)^2$ about the origin. Work through the following steps to describe each rotation by an explicit linear map and then identify the full set.
  
  1. *Rotation formula*
     
     Write the rotation by angle $theta$ as a linear transformation:
     $ R_theta = mat(cos(theta), -sin(theta); sin(theta), cos(theta)) $
     
     acting on column vectors $vec(x, y)$.
     
     Show that $R_theta$ is linear and sends the unit circle to itself.
  
  2. *Basic properties*
     
     a) Prove that $det(R_theta) = 1$, so $R_theta in "GL"_2(bb(R))$.
     
     b) Show $R_theta^T R_theta = I$, so $R_theta in "SO"(2)$.
  
  3. *Composition and inverses*
     
     Compute $R_theta R_phi$ and prove:
     $ R_theta R_phi = R_(theta + phi). $
     
     Identify the identity $R_0$ and inverse $R_theta^(-1)$.
  
  4. *Identify the set of all rotations*
     
     Let $cal(R) = {R_theta : theta in bb(R)}$.
     
     a) Show $cal(R)$ is closed under composition and inverses, hence a subgroup of $"GL"_2(bb(R))$ (#text(red)[the subgroup part can be left for now]).
     
     b) Show $cal(R) subset.eq "SO"(2)$.
     
     c) Prove that any $A in "SO"(2)$ equals $R_theta$ for some $theta$. Conclude $cal(R) = "SO"(2)$.
  
  5. *Group isomorphisms*. #text(red)[This part will be discussed later.]
     
     Show:
     $ cal(R) tilde.equiv S^1 tilde.equiv bb(R) slash 2pi bb(Z) $
     
     via the maps $R_theta |-> e^(i theta)$ and $theta |-> [theta]$.
]

#prob[
  #text(orange)[*The following problem discusses the relation between composition of linear maps and corresponding matrices*.]

  Let $V,W,U$ be vector spaces. Let ${v_1, dots, v_m}$, ${w_1, dots, w_n}$ and ${u_1, dots, u_k}$ be bases for $V,W$ and $U$, respectively. Let 
  $
    T: V -> W, quad S: W -> U
  $
  be linear maps. Let $A$ and $B$ be the matrices associated with $T$ and $S$, respectively. Then the matrix associated with $S compose T$ is $A B$.

  #text(blue)[Hint: Write 
  $
    T(v_i) = sum_(j=1)^n a_(i j)w_j "and" S(w_j) = sum_(r = 1)^k b_(j r)u_r. 
  $
  Then show that $S compose T (v_i) = sum_(r = 1)^k c_(i r)u_r$, where $c_(i r) = sum_(j=1)^n a_(i j) b_(j r)$. Finally conclude that the matrix is $A B$.
  ]
]

#prob[
  For a linear transformation $T: V -> W$, define 
  $
    ker T & := {v in V: T(v) = 0} "and" \
    im T & := T(V) = {w in W : exists v in V " such that" T(v) = w}.
  $
  Show that $ker T$ is a subspace of $V$ and $im T$ is a subspace of $W$. 

  #text(blue)[
    Hint: For a vector space $V$, to check $W$ is a subspace of $V$ it is enough to check the following properties: 
    - Closed under addition
    - Closed under scalar multiplication
    - $0 in W$
  ]
]

#prob[
  Find the range (dimension of the image) and kernel of $T: bb(R)^3 -> bb(R)^3$ defined by 
  $
    mat(x;y;z) |->mat(x + z; x + y + 2z; 2x + y + 3z).
  $
]

#prob[
  Let $V = bb(R)^2$. Let $cal(B) = {(9,2), (4,-3)}$; and $cal(C) = {(2,1), (-3,1)}$ be ordered bases of $V$. Find the change of basis matrix $P_(C <- B)$ and $P_(B <- C)$ if $cal(B)$ and $cal(C)$ are ordered bases of $bb(R)^2$. 
]

// #prob[
//   The _rank_ of a linear map $T$ is defined as the dimesnion of the $im T$ and  the _nullity_ of $T$ is defined as the dimension of $ker T.$ Let $T: V -> W$ be a linear map between finite dimensional vector spaces. According to the _rank-nullity theorem_ 
//   $
//     "rank" T + "nullity" T = dim V. 
//   $
//   Use the rank-nullity theorem to discuss
// ]