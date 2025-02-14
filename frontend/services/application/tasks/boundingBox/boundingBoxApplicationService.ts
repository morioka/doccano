import { AnnotationApplicationService } from '../annotationApplicationService'
import { BoundingBoxDTO } from './boundingBoxData'
import { ApiBoundingBoxRepository } from '~/repositories/tasks/boundingBox/apiBoundingBoxRepository'
import { BoundingBoxItem } from '~/domain/models/tasks/boundingBox'

export class BoundingBoxApplicationService extends AnnotationApplicationService<BoundingBoxItem> {
  constructor(readonly repository: ApiBoundingBoxRepository) {
    super(new ApiBoundingBoxRepository())
  }

  public async list(projectId: string, exampleId: number): Promise<BoundingBoxDTO[]> {
    const items = await this.repository.list(projectId, exampleId)
    return items.map((item) => new BoundingBoxDTO(item))
  }

  public async create(
    projectId: string,
    exampleId: number,
    uuid: string,
    label: number,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void> {
    const item = new BoundingBoxItem(0, uuid, label, x, y, width, height)
    try {
      await this.repository.create(projectId, exampleId, item)
    } catch (e: any) {
      console.log(e.response.data.detail)
    }
  }

  public async update(
    projectId: string,
    exampleId: number,
    annotationId: number,
    item: BoundingBoxDTO
  ): Promise<void> {
    const bbox = new BoundingBoxItem(
      item.id,
      item.uuid,
      item.label,
      item.x,
      item.y,
      item.width,
      item.height
    )
    try {
      await this.repository.update(projectId, exampleId, annotationId, bbox)
    } catch (e: any) {
      console.log(e.response.data.detail)
    }
  }
}
