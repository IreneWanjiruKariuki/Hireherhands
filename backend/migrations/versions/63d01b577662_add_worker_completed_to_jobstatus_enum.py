"""Add worker_completed to JobStatus enum

Revision ID: 63d01b577662
Revises: 07628e4ba24e
Create Date: 2025-07-01 16:33:15.985489

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '63d01b577662'
down_revision: Union[str, None] = '07628e4ba24e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
