import data_manager


def id_generate():
    questions = data_manager.get_all_data_question()
    if len(questions) == 0:
        new_id = 1
    else:
        id_list = []
        for item in questions:
            id_list.append(item['id'])
        new_id = len(questions) + 1
        a = True
        while a:
            if new_id in id_list:
                new_id += 1
            else:
                a = False
    return new_id