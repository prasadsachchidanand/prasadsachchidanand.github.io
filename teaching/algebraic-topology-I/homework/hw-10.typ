#import "template.typ": *
#let title = "Homework #10"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Algebraic Topology I"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2026"
#let prob_type = "covering space and lifting criterion"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)
#show math.equation.where(block: true): eq => {
  block(width: 100%, inset: 0pt, align(center, eq))
}

#prob[
  Let $p: E to B$ be a covering map. Then the diagonal $ Delta = {(e,e): e in E} subset.eq E times E $ is open and closed in $Z = {(x,y) in E times E: p(x) = p(y)}$.
]

#prob[
  Let $p: E to B$ be a covering map. Let $f_0, f_1 : X to E$ be two liftings of a map $f: X to B$. Suppose $f_0$ and $f_1$ agree somewhere. If $X$ is connected, then $f_0 = f_1$.     
]

#prob[
  Let $f: [0,1] to SS^1$ be a loop based at $a = (1,0)$, and $p: RR to SS^1$ be a covering map given by $p(t) = (cos(2pi t), sin(2pi t))$. Show that there exists a unique path $tilde(f): [0,1] to RR$ such that $hat(f)(0) = 0$ and $p compose hat(f) = f$.  

  #text(fill: red)[Do not use the lifting criterion to solve this problem.]
]

#prob[
  Let $p : E to B$ be a cvoering map, with $p(e_0) = b_0$. Then the induced map $p_*: pi_1(E, e_0) to pi_1(B, b_0)$ is injective. Hence or otherwise show that the covering space of a simply connected, locally path connected space is a simply connected, locally path connected space.  
]

#prob[
  Let $p: hat(G) to G$ be a homomorphism of topological groups which is a covering map. Prove that if $G$ is abelian, then $hat(G)$ is also abelian.  
]

#prob[
  Let $E$ be path-connected and $p: E to B$ be a compact continuous covering map. Show that $pi_1(X)$ is finite. 
]