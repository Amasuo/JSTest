import { DragDropContext, DragDropContextProps } from 'react-beautiful-dnd';
import { useMemo, useState, useEffect } from 'react';
import produce from 'immer';
import styled from 'styled-components';
import { TaskboardItem, TaskboardItemStatus } from './TaskboardTypes';
import TaskboardItemFormModal, {
  TaskboardItemFormValues,
} from './TaskboardItemFormModal';
import TaskboardCol, { TaskboardColProps } from './TaskboardCol';
import { useSyncedState } from '../shared/SharedHooks';

import axios from 'axios';

const generateId = () => Date.now().toString();

const TaskboardRoot = styled.div`
  min-height: 0;
  height: 100%;
  min-width: 100%;
  max-width: 100%;
  margin: auto;
`;

const TaskboardContent = styled.div`
  height: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-around;
`;

const defaultItems:any = {
  //[TaskboardItemStatus.TO_DO]: [],
  [TaskboardItemStatus.IN_PROGRESS]: [],
  [TaskboardItemStatus.DONE]: [],
};

type TaskboardData = Record<TaskboardItemStatus, TaskboardItem[]>;

function Taskboard() {
  const [itemsByStatus, setItemsByStatus] = useState(
    defaultItems
  );

  useEffect( () => {
    (async () => {
      const data:any = await axios.get('http://localhost:3002/api/todos');
      const in_progress:any[]= [];
      const done:any[] = [];
      data.data.map((todo:any) => {
        if (todo.status == 'In Progress') {
          in_progress.push(todo);
        }
        else {
          done.push(todo);
        }
      })
      console.log(in_progress);
      console.log(done);
      setItemsByStatus(
        {'In Progress': in_progress,
        'Done' : done}
      );
    })();
  },[])


  const handleDragEnd: DragDropContextProps['onDragEnd'] = ({
    source,
    destination,
  }) => {
    setItemsByStatus((current:any) =>
      produce(current, (draft:any) => {
        // dropped outside the list
        if (!destination) {
          return;
        }

        const itemId = current.Done.length == 0? current['In Progress'][0].id: current.Done[0].id;

        axios({
          method : 'put',
          data : {
            'status' : destination.droppableId
          },
          url : 'http://localhost:3002/api/todos/status/'+itemId
        });
        const [removed] = draft[
          source.droppableId as TaskboardItemStatus
        ].splice(source.index, 1);
        draft[destination.droppableId as TaskboardItemStatus].splice(
          destination.index,
          0,
          removed
        );
      })
    );
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [itemToEdit, setItemToEdit] = useState<TaskboardItem | null>(null);

  const openTaskItemModal = (itemToEdit: TaskboardItem | null) => {
    setItemToEdit(itemToEdit);
    setIsModalVisible(true);
  };

  const closeTaskItemModal = () => {
    setItemToEdit(null);
    setIsModalVisible(false);
  };

  const handleDelete: TaskboardColProps['onDelete'] = ({
    status,
    itemToDelete,
  }) =>
    setItemsByStatus((current:any) =>
      produce(current, (draft:any) => {
        draft[status] = draft[status].filter(
          (item:any) => item.id !== itemToDelete.id
        );
      })
    );

  const initialValues = useMemo<TaskboardItemFormValues>(
    () => ({
      title: itemToEdit?.title ?? '',
      description: itemToEdit?.description ?? '',
    }),
    [itemToEdit]
  );

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskboardRoot>
          <TaskboardContent>
            {Object.values(TaskboardItemStatus).map((status) => (
              <TaskboardCol
                key={status}
                status={status}
                items={itemsByStatus[status]}
                onClickAdd={
                  status === TaskboardItemStatus.IN_PROGRESS
                    ? () => openTaskItemModal(null)
                    : undefined
                }
                onEdit={openTaskItemModal}
                onDelete={handleDelete}
              />
            ))}
          </TaskboardContent>
        </TaskboardRoot>
      </DragDropContext>
      <TaskboardItemFormModal
        visible={isModalVisible}
        onCancel={closeTaskItemModal}
        onOk={(values) => {
          setItemsByStatus((current:any) =>
            produce(current, (draft:any) => {
              if (itemToEdit) {
                // Editing existing item
                const draftItem:any = Object.values(draft)
                  .flatMap((items) => items)
                  .find((item:any) => item.id === itemToEdit.id);
                if (draftItem) {
                  draftItem.title = values.title;
                  draftItem.description = values.description;
                }
              } else {
                // Adding new item as "to do"
                draft[TaskboardItemStatus.IN_PROGRESS].push({
                  ...values,
                  id: generateId(),
                });
              }
            })
          );
        }}
        initialValues={initialValues}
      />
    </>
  );
}

export default Taskboard;
