#import "template.typ": *
#let title = "Homework 3 Solution"
#let author = "Dr. Sachchidanand Prasad"
#let course_id = "Matrix Groups"
#let instructor = "Sachchidanand Prasad"
#let semester = "Monsoon 2025"
#let prob_type = "groups"
#set enum(numbering: "1.")
#show: assignment_class.with(title, author, course_id, instructor, semester, prob_type)

#prob[
  Let $M_n (RR)$ denotes the set of all $n times n$ matrices with real entries. Let $bf(x) = (x_1, dots, x_n) in RR^n$. For $A in M_n (RR)$, define
  $
    R_A, L_A : RR^n-> RR^n, quad R_A (bf(x)) = bf(x) dot A, " and " L_A (bf(x))= (A dot bf(x)^T)^T,
  $
  where $bf(x)^T$ denotes the transpose of $bf(x)$.
  
  (i) Show that any linear function from $bb(R)^n -> bb(R)^n$ equals $R_A$ for some $A in M_n (bb(R))$.
  
  (ii) Show that any linear function from $bb(R)^n -> bb(R)^n$ equals $L_A$ for some $A in M_n (bb(R))$.
  
  (iii) We have seen $G L_n (bb(R))$ is the set of all $n times n$ invertible matrices over $bb(R)$. Show that
  $
    G L_n (bb(R)) = {A in M_n (bb(R)): R_A : bb(R)^n -> bb(R)^n " is a linear isomorphism"}.
  $
  
  (iv) Do you think in the previous part (iii), we can replace $bb(R)$ with $bb(H)$? That is, give any $A in M_n (bb(H))$, if $det A != 0$, then $R_A : bb(H)^n -> bb(H)^n$ is invertible.
  
  (v) Find $A in M_2(bb(R))$ such that $R_A : bb(R)^2 -> bb(R)^2$ is a counterclockwise rotation through an angle $theta$.
]

#soln[
  (i) First let us understand the map $R_A$. If $A = mat(2,1; 4,3)$, then for any $bf(v) = (x,y) in RR^2$, we have 
  $
    R_A (x,y) = (x,y) mat(2,1;4,3) = (2x + 4y, x + 3y).
  $ 
  If $T: RR^n to RR^n$ be a linear transformation. Let ${bf(e)_1, bf(e)_2, dots, bf(e)_n}$ be the standard basis for $RR^n$. Then set the $i^("th")$ row of $A$ as $T bf(e)_i$, that is,  
  $
    A = mat(
      —— T bf(e)_1 ——;
      —— T bf(e)_2 ——;
      dots.v;
      —— T bf(e)_n ——
    ).
  $
  Then we claim that $T = R_A$. Note that 
  $
    R_A (bf(e)_i) = bf(e)_i dot A = i^("th")"-row of "A = T bf(e)_i.
  $ 
  Thus, the linear maps $R_A$ and $T$ are equal on basis and hence they are same linear maps. 

  (ii) Note that 
  $
    L_A (bf(x)) = (A dot bf(x)^T)^T = bf(x) dot A^T = R_(A^T).
  $  
  This time we set $T bf(e)_i$ as the $i^("th")$-column of $A$. So, we can find a linear trasnformation $T: RR^n to RR^n$ such that $T = L_A$.  

  (iii) We claim that $A$ is invertible, iff $R_A$ is a linear isomorphism. Note that for any $A, B in M_n (RR)$ 
  $
    (R_A compose R_B)(bf(x)) = R_A (bf(x) dot B) = (bf(x) dot B) dot A = bf(x) dot B A = R_(B A) (bf(x)). 
  $    
  Thus, if $A$ is invertible, then $R_A compose R_(A^(-1)) = R_I = I_(RR^n)$.  

  For the converse, let $A in M_n (RR)$ be such that $R_A$ is a linear isomorphism with an inverse $(R_A)^(-1)$. Then we claim that $A$ is invertible. Note that $(R_A)^(-1)$ is also linear as 
  $
    & R_A ((R_A)^(-1)(a bf(x) + bf(y)) - (a (R_A)^(-1)(bf(x)) + (R_A)^(-1)(bf(y)))) \
    = & R_A ((R_A)^(-1)(a bf(x) + bf(y)))- R_A (a (R_A)^(-1)(bf(x))) - R_A ((R_A)^(-1)(bf(y))) \
    = & a bf(x) + bf(y) - a bf(x) - bf(y) = bf(0).
  $ 
  Thus, $(R_A)^(-1)$ is a linear map. Since every linear map can be represented by a matrix, $(R_A)^(-1) = R_B$ for $B in M_n (RR)$. Since 
  $
    I = R_A compose R_B = R_(B A) => B A = I.
  $   
  Similarly, $A B = I$ and hence $A$ is invertible.   
  
    // Let $T in GL(n,R)$, that is, $T: RR^n to RR^n$ is a linear isomorphism. Using part (i), we can find matrix $A in M_n (RR)$ such that $T = R_A$. Since the rows of $A$ are $T bf(e)_i$, which are linearly independent and hence $A$ is invertible. Thus, the map $R_A$ is a linear isomorphism with inverse as $R_(A^(-1))$. For the converse let $A in M_n (RR)$ such that $R_A$ is a linear isomorphism. This implies, ${R_A (bf(e)_1), dots, R_A (bf(e)_n)}$ is linearly independent. Since $R_A (bf(e)_i)$ is the $i^("th")$-row of $A$, the matrix $A$ is invertible matrix and hence $A in GL(n,R)$.

  (iv) This need not be true. For example, take 
  $
    A = mat(iota, j; iota, j).
  $ 
  Then for any $x in HH minus {0}$, 
  $
    R_A (x,-x) = ((x - x)i, (x - x)j) = (0,0).
  $ 
  Thus, $R_A$ is not invertible. 

  (v) We know that the matrix of such rotation is given by 
  $
    A_theta = mat(cos theta, sin theta; - sin theta, cos theta). 
  $
  So, the matrix of the linear map $R_A$ should be $A_theta$. Then from part (i),  
  $
    A = mat(A_theta bf(e)_1; A_theta bf(e)_2) = mat(cos theta, sin theta; -sin theta, cos theta). 
  $
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