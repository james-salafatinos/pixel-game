# Lex


# let obs1 = G1{2} X G2{4}
# let obs2 = G1{4} X G2{2}

# node values
G1_num = [1, 1]

# node values
G2_num = [1, 2, 3, 4]

G1_str = ['1', '2']
G2_str = ['A', 'B', 'C', 'D']
G_adj = [[1, 0, 0, 0], [0, 0, 0, 0]]

H = -1


def lproduct(_G1, _G2):
    # We are these guys (2) looking at the group (4)
    fwd = []
    # Were all a group (4) and were looking at these guys (2)

    ####
    # Accounting for each of the bosses individual viewpoint on every entity in Set 2
    ####
    _H = []
    # add all the right vertices
    for i in range(len(_G1)):
        for j in range(len(_G2)):
            _H.append([_G1[i] + _G2[j]])

    # for i in range(len(_H)):
    #     for j in range(len(_H)):
    #         _H.append(_G1[i] + _G2[j])
    #         # Second ajacnecy law, copied vertices

    return _H

# Were all a group (4) and were looking at these guys (2)
# We are these guys (2) looking at the group (4)


print(lproduct(G1_str, G2_str))
