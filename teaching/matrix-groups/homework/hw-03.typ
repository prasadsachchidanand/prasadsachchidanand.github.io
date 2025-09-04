#import "template.typ": *
#let title = "Homework #3"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "groups"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)


#prob[
  Define 
  $
    R_A, L_A : RR^n-> RR^n, quad R_A (X) = X dot A, " and " L_A (X)= (A dot X^T)^T,
  $
  where $X^T$ denotes the transpose of $X$. 
  
  (i) Show that any linear function from $bb(R)^n -> bb(R)^n$ equals $R_A$ for some $A in M_n (bb(R))$.

  (ii) Show that any linear function from $bb(R)^n -> bb(R)^n$ equals $L_A$ for some $A in M_n (bb(R))$.

  (iii) We have seen $G L_n (bb(R))$ is the set of all $n times n$ invertible matrices over $bb(R)$. Show that 
  $
    G L_n (bb(R)) = {A in M_n (bb(R)): R_A : bb(R)^n -> bb(R)^n " is a linear isomorphism"}.
  $   

  (iv) Do you think in the previous part (iii), we can replace $bb(R)$ with $bb(H)$? That is, give any $A in M_n (bb(H))$, if $det A != 0$, then $R_A : bb(H)^n -> bb(H)^n$ is invertible. 

  (v) Find $A in M_2(bb(R))$ such that $R_B : bb(R)^2 -> bb(R)^2$ is a counterclockwise rotation through an angle $theta$. 
]

#prob[
  (i) Let $G L_2 (bb(Z))$ denote the set of all $2 times 2$ matrices with integer entries and nonzero determinant. Is $G L_2 (bb(Z))$ a group with usual matrix multiplicaiton?
  
  (ii) Let $S L_2 (bb(Z))$ denote the set of all $2 times 2$ matrices with integer entries and determinant $1$. Prove that $S L_2 (bb(Z))$ is a subgroup of $G L_2 (bb(R))$. Is it a normal subgroup?

  (iii) Is $S L_n (bb(Z))$ a subgroup of $G L_n (bb(R))$?
]

#prob[
  Let $G,H$ are groups. Let $phi: G -> H$ be a group homomorphism. 

  (i) Prove that $ker phi$ is a normal subgroup of $G$.

  (ii) Show that $im phi$ is a subgroup of $H$. Is it a normal subgroup?
]

#prob[
  Describe a subgroup of $G L_(n+1) (bb(R))$ that is isomorphic to the group $bb(R)^n$ under the operation of vector addition. 
]