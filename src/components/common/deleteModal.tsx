import Modal from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import frFR from "@/lang/fr-FR";

export default function DeleteModal({
  openModal,
  closeModal,
  titleText,
  descriptionText,
  deletefunction,
  desable,
}: {
  openModal: boolean;
  closeModal: () => void;
  titleText: string;
  descriptionText: string;
  deletefunction: () => void;
  desable?: boolean;
}) {
  const t = frFR;

  return (
    <Modal openModal={openModal} closeModal={closeModal}>
      <div>
        <div className="flex w-full flex-col items-center space-y-1">
          <div className="text-lg font-semibold">{`${titleText}`}</div>
          <div>{`${descriptionText}`}</div>
        </div>
        <div className="mt-5 flex w-full justify-center space-x-5">
          <Button
            type="button"
            variant={"secondary"}
            className="w-[30%]"
            onClick={closeModal}
          >
            {t.shared.cancel}
          </Button>
          <Button
            type="button"
            variant={"default"}
            className="w-[30%]"
            onClick={deletefunction}
          >
            {desable ? t.shared.desable : t.shared.delete}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
